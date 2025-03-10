import { validate } from "class-validator";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Quest, QuestCreateInput } from "../entities/Quest";
import { Mission } from "../entities/Mission";
import { User, UserQuestPoints } from "../entities/User";
import { ContextType } from "../auth";
import { UserMission } from "../entities/UserMission";

@Resolver(Quest)
export class QuestResolver {
  @Query(() => [Quest])
  async getQuests() {
    const Quests = await Quest.find({
      relations: { missions: true, users: true, createdBy: true },
    });
    return Quests;
  }

  @Authorized()
  @Query(() => Quest)
  async getQuestById(@Arg("id", () => ID) id: number): Promise<Quest> {
    const quest = await Quest.findOne({
      where: { id },
      relations: { missions: true, users: true, createdBy: true },
    });
    if (!quest) {
      throw new Error("Pas de quête liée à cette 'id'");
    }
    return quest;
  }

  @Query(() => [Quest])
  async getQuestByUser(
    @Arg("userId", () => ID) userId: number
  ): Promise<Quest[]> {
    // Rechercher les quêtes avec les relations spécifiées
    const quests = await Quest.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: { missions: true, users: true, createdBy: true },
    });

    if (!quests || quests.length === 0) {
      throw new Error("Pas de quête liée à cette 'userId'");
    }

    // Charger les UserMissions pour chaque user dans les quêtes
    for (const quest of quests) {
      for (const user of quest.users) {
        const userWithMissions = await User.findOne({
          where: { id: user.id },
          relations: { userMissions: true }, // Charger les UserMissions
        });
        user.userMissions = userWithMissions?.userMissions || [];
      }
    }

    return quests;
  }

  @Query(() => [Quest])
  async getQuestByCode(
    @Arg("code", () => Number) code: number
  ): Promise<Quest[]> {
    const quest = await Quest.find({
      where: { code },
      relations: { missions: true, users: true, createdBy: true },
    });
    if (!quest) {
      throw new Error("Pas de quête liée à de 'code'");
    }
    return quest;
  }

  @Authorized()
  @Mutation(() => Quest)
  async createQuest(
    @Ctx() context: ContextType,
    @Arg("data", () => QuestCreateInput) data: QuestCreateInput
  ): Promise<Quest> {
    const newQuest = new Quest();
    newQuest.title = data.title;
    newQuest.description = data.description;
    newQuest.startDate = data.startDate;
    newQuest.duration = data.duration;
    newQuest.difficulty = data.difficulty;

    const user = context.user;

    if (!user) {
      throw new Error("Unable to determine the current user.");
    }

    newQuest.createdBy = user;

    // Add the creator to the users array
    newQuest.users = [user];

    const errors = await validate(newQuest);
    if (errors.length > 0) {
      throw new Error(
        `Validation failed: ${errors.map((err) => err.toString()).join(", ")}`
      );
    }

    if (data.missions && data.missions.length > 0) {
      const missions = await Mission.findByIds(data.missions);
      newQuest.missions = missions;
    }

    let uniqueCode: number;
    do {
      uniqueCode = Math.floor(100000 + Math.random() * 900000);
    } while (await Quest.findOne({ where: { code: uniqueCode } }));

    newQuest.code = uniqueCode;

    if (data.users && data.users.length > 0) {
      const users = await User.findByIds(data.users);
      newQuest.users = users;
    }

    await newQuest.save();

    return newQuest;
  }

  @Mutation(() => Quest, { nullable: true })
  async deleteQuest(@Arg("id", () => ID) id: number): Promise<Quest | null> {
    const ads = await Quest.findOne({ where: { id: id } });
    if (ads) {
      await ads.remove();
      ads.id = id;
    }
    return ads;
  }

  // allow a user to join a quest with its unique code
  @Authorized()
  @Mutation(() => Quest)
  async joinQuestByCode(
    @Ctx() context: ContextType,
    @Arg("code", () => Number) code: number
  ): Promise<Quest> {
    const quest = await Quest.findOne({
      where: { code },
      relations: { users: true },
    });

    if (!quest) {
      throw new Error("Il n'existe pas  de quête liée à ce code");
    }

    const user = context.user;

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // verify if an element already exists in the array of users
    if (quest.users.some((existingUser) => existingUser.id === user.id)) {
      throw new Error("Tu as déjà rejoint cette quête");
    }

    quest.users.push(user);

    await quest.save();

    return quest;
  }

  @Query(() => [UserQuestPoints])
  async getTotalPointsForQuest(
    @Arg("userIds", () => [ID]) userIds: number[],
    @Arg("questId", () => ID) questId: number
  ): Promise<UserQuestPoints[]> {
    const results = await Promise.all(
      userIds.map(async (userId) => {
        const userMissions = await UserMission.find({
          where: { user: { id: userId }, mission: { quests: { id: questId } } },
          relations: ["user", "mission", "mission.quests"],
        });

        if (!userMissions.length) {
          return { userId, points: 0 };
        }

        const totalPoints = userMissions.reduce((acc, userMission) => {
          return acc + userMission.points;
        }, 0);

        return { userId, points: totalPoints };
      })
    );
    console.log(results);

    return results;
  }
}
