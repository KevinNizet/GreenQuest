import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { User } from "./User";
import { Mission } from "./Mission";

@Entity()
@ObjectType()
export class UserMission extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @ManyToOne(() => User, (user) => user.userMissions)
  @JoinColumn({ name: "userId" })
  @Field(() => User)
  user!: User;

  @ManyToOne(() => Mission, (mission) => mission.userMissions)
  @JoinColumn({ name: "missionId" })
  @Field(() => Mission)
  mission!: Mission;

  @Column({ default: false })
  @Field()
  isCompleted!: boolean;

  @Column({ default: 0 })
  @Field()
  points!: number;
}
