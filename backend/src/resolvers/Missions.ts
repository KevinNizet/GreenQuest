import { validate } from "class-validator";
import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Mission, MissionCreateInput } from "../entities/Mission";
import { Difficulty, Quest } from "../entities/Quest";
import { UserMission } from "../entities/UserMission";
import { User } from "../entities/User";

@Resolver(Mission)
export class MissionResolver {
  @Query(() => [Mission])
  async getMissions(
    @Arg("sortBy", () => Difficulty, { nullable: true }) sortBy?: Difficulty
  ): Promise<Mission[]> {
    let missions: Promise<Mission[]> = Mission.find();

    if (sortBy) {
      missions = Mission.find({
        where: { difficulty: sortBy },
      });
    }

    return missions;
  }

  @Mutation(() => Mission)
  async createMission(
    @Arg("data", () => MissionCreateInput) data: MissionCreateInput
  ): Promise<Mission> {
    const newMission = new Mission();

    Object.assign(newMission, data);

    const errors = await validate(newMission);

    if (errors.length === 0) {
      await newMission.save();
      return newMission;
    } else {
      throw new Error(`Validation failed!`);
    }
  }

  @Mutation(() => UserMission)
  async validateMission(
    @Arg("userId", () => ID) userId: number,
    @Arg("missionId", () => ID) missionId: number,
    @Arg("questId", () => ID) questId: number
  ): Promise<UserMission> {
    let userMission = await UserMission.findOne({
      where: {
        user: { id: userId },
        mission: { id: missionId },
      },
      relations: ["user", "mission", "quest"],
    });

    if (!userMission) {
      const user = await User.findOne({ where: { id: userId } });
      const mission = await Mission.findOne({ where: { id: missionId } });
      const quest = await Quest.findOne({ where: { id: questId } });

      if (!user || !mission || !quest) {
        throw new Error("User, Mission or Quest not found");
      }

      userMission = new UserMission();
      userMission.user = user;
      userMission.mission = mission;
      userMission.quest = quest;
      userMission.points = 0;
    } else {
      if (userMission.isCompleted) {
        throw new Error("Mission is already completed");
      }
    }

    userMission.isCompleted = true;
    userMission.points += userMission.mission.XPValue;

    await userMission.save();

    return userMission;
  }
}
