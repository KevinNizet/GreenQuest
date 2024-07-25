import { Arg, ID, Query, Resolver } from "type-graphql";

import { UserMission } from "../entities/UserMission";

const argon2 = require("argon2");

// return all users
@Resolver(UserMission)
export class UserMissionResolver {
  @Query(() => [UserMission])
  async getUserMissions(
    @Arg("userId", () => ID) userId: number
  ): Promise<UserMission[]> {
    const userMissions = await UserMission.find({
      where: { user: { id: userId } },
      relations: {
        mission: { quests: true },
        user: true,
      },
    });
    return userMissions;
  }
}
