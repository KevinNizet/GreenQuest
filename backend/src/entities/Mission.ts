import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Difficulty, Quest } from "./Quest";
import { UserMission } from "./UserMission";

@Entity()
@ObjectType()
export class Mission extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Field()
  title!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description!: string;

  @Column({ default: 5 })
  @Field()
  XPValue!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @Field()
  createdAt!: Date;

  @Column({ default: "EASY" })
  @Field(() => Difficulty)
  difficulty!: string;

  @Column({ default: false })
  @Field()
  byDefault!: boolean;

  @ManyToMany(() => Quest, (quest) => quest.missions)
  @JoinTable()
  @Field(() => [Quest], { nullable: true })
  quests!: Quest[];

  @OneToMany(() => UserMission, (userMission) => userMission.mission)
  @Field(() => [UserMission])
  userMissions!: UserMission[];
}

@InputType()
export class MissionCreateInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  XPValue!: number;

  @Field(() => Difficulty, { nullable: true })
  difficulty!: Difficulty;

  @Field({ nullable: true })
  byDefault!: boolean;
}
