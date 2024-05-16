import { validate } from "class-validator";
import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import { Quest, QuestCreateInput } from "../entities/Quest";
import { Mission } from "../entities/Mission";
import { User } from "../entities/User";

@Resolver(Quest)
export class QuestResolver {
  @Query(() => [Quest])
  async getQuests() {
    const Quests = await Quest.find({
      relations: { missions: true, users: true },
    });
    return Quests;
  }

  // @Authorized() l'ajouter une fois que l'on aura modifié les tests backend.
  @Query(() => Quest)
  async getQuestById(@Arg("id", () => ID) id: number): Promise<Quest> {
    const quest = await Quest.findOne({
      where: { id },
      relations: { missions: true },
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
    const quest = await Quest.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: { missions: true, users: true },
    });
    if (!quest) {
      throw new Error("Pas de quête liée à cette 'id'");
    }
    console.log(quest, "  backend");
    return quest;
  }

  @Query(() => [Quest])
  async getQuestByCode(
    @Arg("code", () => Number) code: number
  ): Promise<Quest[]> {
    const quest = await Quest.find({
      where: { code },
      relations: { missions: true, users: true },
    });
    if (!quest) {
      throw new Error("Pas de quête liée à cette 'id'");
    }
    console.log(quest, " code backend");
    return quest;
  }

  // @Authorized() l'ajouter une fois que l'on aura modifié les tests backend.
  @Mutation(() => Quest)
  async createQuest(
    @Arg("data", () => QuestCreateInput) data: QuestCreateInput
  ): Promise<Quest> {
    const newQuest = new Quest();
    newQuest.title = data.title;
    newQuest.description = data.description;
    newQuest.startDate = data.startDate;
    newQuest.duration = data.duration;
    newQuest.difficulty = data.difficulty;

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
}
