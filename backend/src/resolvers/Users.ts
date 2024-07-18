import {
  Arg,
  ID,
  Query,
  Resolver,
  Mutation,
  Ctx,
  Authorized,
} from "type-graphql";
import {
  ChangePasswordInput,
  User,
  UserCreateInput,
  UserUpdateInput,
} from "../entities/User";
import { validate } from "class-validator";
import Cookies from "cookies";
import jwt from "jsonwebtoken";
import { ContextType, getUserFromReq } from "../auth";
import { UserToken } from "../entities/UserToken";
import { addDays, isBefore } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { sendResetPassword } from "../email";
import { sendValidationEmail } from "../AccountValidationWithEmail";
import { ObjectID } from "../entities/ObjectId";
import { Image as ImageEntity } from "../entities/Image";

const argon2 = require("argon2");

@Resolver(User)
export class UserResolver {
  // return all users
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    const users = await User.find({
      relations: {
        questsParticipated: true,
        questsCreated: true,
        userMissions: true,
        image: true,
      },
    });
    return users;
  }
  // return one user
  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => ID) id: number): Promise<User> {
    const user = await User.findOne({
      where: { id: id },
      select: ["id", "firstname", "lastname", "nickname", "email"],
      relations: {
        questsParticipated: true,
        questsCreated: true,
        userMissions: true,
        image: true,
      },
    });
    if (!user) {
      throw new Error("Pas de user lié à cette 'id'");
    }
    return user;
  }

  // signup query
  @Mutation(() => User)
  async signup(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    const errors = await validate(data);
    if (errors.length !== 0) {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }

    //custom error if user already exists
    const existingUser = await User.findOneBy({ email: data.email });
    if (existingUser) {
      throw new Error(`Existing user`);
    }

    //create new user with hashed password
    const newUser = new User();
    const hashedPassword = await argon2.hash(data.password);
    Object.assign(newUser, {
      firstname: data.firstname,
      lastname: data.lastname,
      nickname: data.nickname,
      email: data.email,
      hashedPassword,
      isValidatedAccount: false,
    });

    await newUser.save();

    // Generate account validation token
    const token = new UserToken();
    token.user = newUser;
    token.createdAt = new Date();
    token.expiresAt = addDays(new Date(), 2);
    token.token = uuidv4();

    await token.save();

    // Send validation email
    await sendValidationEmail(data.email, token.token);

    return newUser;
  }

  @Mutation(() => Boolean)
  async validateAccount(@Arg("token") token: string): Promise<boolean> {
    const userToken = await UserToken.findOne({
      where: { token },
      relations: { user: true },
    });

    if (!userToken) {
      throw new Error("Invalid token");
    }

    if (isBefore(new Date(userToken.expiresAt), new Date())) {
      throw new Error("Expired token");
    }

    const user = userToken.user;
    // Set the account to validated
    user.isValidatedAccount = true;
    await user.save();

    await userToken.remove();

    return true;
  }

  // query to get self profile
  @Query(() => User, { nullable: true })
  async mySelf(@Ctx() context: ContextType): Promise<User | null> {
    return getUserFromReq(context.req, context.res);
  }

  // query de Màj des data utilisateur
  @Authorized()
  @Mutation(() => User)
  async updateUser(
    @Arg("data", () => UserUpdateInput) data: UserUpdateInput,
    @Ctx() context: ContextType
  ): Promise<User> {
    // Extraction de l'identifiant de l'utilisateur à partir du contexte
    const userId = context?.user?.id;

    if (!userId) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    const user = await User.findOneBy({ id: userId });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Màj des données de l'utilisateur en fonction des données fournies
    if (data.firstname !== undefined) {
      user.firstname = data.firstname;
    }
    if (data.lastname !== undefined) {
      user.lastname = data.lastname;
    }
    if (data.nickname !== undefined) {
      user.nickname = data.nickname;
    }

    // ENregistrement en BDD
    await user.save();

    return user;
  }

  // MAJ de l'avatar
  @Authorized()
  @Mutation(() => User)
  async updateUserImage(
    @Arg("image", () => ObjectID) imageObject: ObjectID,
    @Ctx() context: ContextType
  ): Promise<User> {
    const userId = context?.user?.id;

    if (!userId) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const image = await ImageEntity.findOne({ where: { id: imageObject.id } });

    if (!image) {
      throw new Error("Image non trouvée");
    }

    user.image = image;

    await user.save();

    return user;
  }

  // Mutation de MàJ du mot passe utilisateur
  @Authorized()
  @Mutation(() => Boolean)
  async changePassword(
    @Arg("data") data: ChangePasswordInput,
    @Ctx() context: ContextType
  ): Promise<boolean> {
    const { currentPassword, newPassword } = data;

    // Récupération de l'ID de l'utilisateur à partir du contexte
    const userId = context?.user?.id;

    if (!userId) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    const user = await User.findOneBy({ id: userId });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Vérification du mot de passe actuel
    const isPasswordValid = await argon2.verify(
      user.hashedPassword,
      currentPassword
    );

    if (!isPasswordValid) {
      throw new Error("Mot de passe actuel incorrect");
    }

    // Hash du nouveau mot de passe
    const hashedNewPassword = await argon2.hash(newPassword);

    // Mise à jour du mot de passe dans la base de données
    user.hashedPassword = hashedNewPassword;
    await user.save();

    return true;
  }

  @Mutation(() => User, { nullable: true })
  async signin(
    @Ctx() context: { req: any; res: any },
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    const existingUser = await User.findOne({
      where: { email },
      relations: { image: true },
    });

    // Vérifiez si le compte est validé
    if (!existingUser?.isValidatedAccount) {
      throw new Error(
        "Ton compte n'est pas encore validé. Vérifie ton email pour le valider."
      );
    }

    //verify if user exists
    if (existingUser) {
      const isPasswordValid = await argon2.verify(
        existingUser.hashedPassword,
        password
      );
      // verify if password is valid

      if (isPasswordValid) {
        const token = jwt.sign(
          {
            userId: existingUser.id,
          },
          `${process.env.JWT_SECRET}`
        );

        const cookies = new Cookies(context.req, context.res);
        cookies.set("token", token, {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 24,
        });

        return existingUser;
      } else {
        console.log(password, "wrong password");
        return null;
      }
    } else {
      console.log(existingUser, "user does not exists");
      return null;
    }
  }

  @Mutation(() => Boolean)
  async signout(@Ctx() context: ContextType): Promise<Boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", {
      httpOnly: true,
      secure: false,
      maxAge: 0,
    });
    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg("email") email: string,
    @Ctx() context: ContextType
  ): Promise<boolean> {
    const connectedUser = await getUserFromReq(context.req, context.res);

    if (connectedUser) {
      throw new Error("User already connected");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = new UserToken();
    token.user = user;
    token.createdAt = new Date();
    token.expiresAt = addDays(new Date(), 2);
    token.token = uuidv4();

    await token.save();
    await sendResetPassword(email, token.token);
    return true;
  }

  @Mutation(() => Boolean)
  async setPassword(
    @Arg("token") token: string,
    @Arg("password") password: string
  ): Promise<boolean> {
    const userToken = await UserToken.findOne({
      where: { token },
      relations: { user: true },
    });

    if (!userToken) {
      throw new Error("Invalid token");
    }

    if (isBefore(new Date(userToken.expiresAt), new Date())) {
      throw new Error("Expired token");
    }

    const hashedPassword = await argon2.hash(password);
    userToken.user.hashedPassword = hashedPassword;
    await userToken.user.save();

    await userToken.remove();

    return true;
  }
}
