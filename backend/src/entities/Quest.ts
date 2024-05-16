import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectID } from "./ObjectId";
import { Mission } from "./Mission";
import { User } from "./User";

export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

registerEnumType(Difficulty, {
  name: "Difficulty",
});

@Entity()
@ObjectType()
export class Quest extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Field()
  title!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description!: string;

  @Column()
  @Field()
  startDate!: Date;

  @Column()
  @Field()
  duration!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @Field()
  createdAt!: Date;

  @Column({ type: "enum", enum: Difficulty, default: Difficulty.EASY })
  @Field(() => Difficulty)
  difficulty!: Difficulty;

  @ManyToMany(() => Mission, (mission) => mission.quests)
  @Field(() => [Mission], { nullable: true })
  missions!: Mission[];

  @Column()
  @Field({ nullable: true })
  code!: number;

  @ManyToMany(() => User, (user) => user.quests)
  @Field(() => [User], { nullable: true })
  users!: User[];
}

@InputType()
export class QuestCreateInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description!: string;

  @Field()
  startDate!: Date;

  @Field()
  duration!: number;

  @Field(() => Difficulty, { nullable: true })
  difficulty!: Difficulty;

  @Field(() => [ID], { nullable: true })
  missions: number[];

  @Field({ nullable: true })
  code!: number;

  @Field(() => [ID], { nullable: true })
  users!: number[];
}
