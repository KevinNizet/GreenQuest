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
import { UserMission } from "../entities/UserMission";

const argon2 = require("argon2");

// return all users
@Resolver(UserMission)
export class UserMissionResolver {
  @Query(() => [UserMission])
  async getUserMissions(): Promise<UserMission[]> {
    const userrMissons = await UserMission.find({
      relations: {
        mission: { quests: true },
        user: true,
      },
    });
    return userrMissons;
  }
}
