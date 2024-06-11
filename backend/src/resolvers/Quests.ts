import { validate } from "class-validator";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Quest, QuestCreateInput } from "../entities/Quest";
import { Mission } from "../entities/Mission";
import { User } from "../entities/User";
import { ContextType } from "../auth";

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
    console.log(quest);
    if (!quest) {
      throw new Error("Pas de quête liée à cette 'id'");
    }
    return quest;
  }

  @Query(() => [Quest])
  async getQuestByUser(
    @Arg("userId", () => ID) userId: number
  ): Promise<Quest[]> {
    const quest = await Quest.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: { missions: true, users: true, createdBy: true },
    });
    if (!quest) {
      throw new Error("Pas de quête liée à cette 'userId'");
    }
    return quest;
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

    console.log(newQuest);

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

    if (!quest.users) {
      quest.users = [];
    }

    // verify if an element already exists in the array of users
    if (quest.users.some(existingUser => existingUser.id === user.id)) {
      throw new Error("Utilisateur déjà inscrit à cette quête");
    }

    quest.users.push(user);

    await quest.save();

    return quest;
  }
}
