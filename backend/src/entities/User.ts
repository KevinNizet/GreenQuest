import { IsEmail, Length, Matches } from "class-validator";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Quest } from "./Quest";
import { UserMission } from "./UserMission";
import { Image } from "./Image";
import { ObjectID } from "./ObjectId";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Length(3, 50, {
    message: "Firstname length",
  })
  @Field()
  firstname!: string;

  @Column()
  @Length(3, 50, { message: "Lastname length" })
  @Field()
  lastname!: string;

  @Column()
  @Length(3, 50, {
    message: "Username length",
  })
  @Field()
  nickname!: string;

  @Column({
    length: 150,
    unique: true,
  })
  @Field()
  @IsEmail()
  email!: string;

  @Column()
  @Field()
  hashedPassword!: string;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @Column("boolean", { default: false })
  @Field()
  isAdmin!: boolean;

  @Column({ default: false })
  isValidatedAccount: boolean;

  @ManyToMany(() => Quest, (Quest) => Quest.users)
  @JoinTable()
  @Field(() => [Quest], { nullable: true })
  questsParticipated!: Quest[];

  @OneToMany(() => Quest, (Quest) => Quest.createdBy)
  @Field(() => [Quest], { nullable: true })
  questsCreated!: Quest[];

  @OneToMany(() => UserMission, (userMission) => userMission.user)
  @Field(() => [UserMission])
  userMissions!: UserMission[];

  @ManyToOne(() => Image, { nullable: true })
  @Field({ nullable: true })
  image!: Image;
}

@ObjectType()
export class UserQuestPoints {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  points: number;
}

@InputType()
export class UserCreateInput {
  @Length(3, 50)
  @Field()
  firstname!: string;

  @Length(3, 50)
  @Field()
  lastname!: string;

  @Length(3, 50)
  @Field()
  nickname!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Matches(/^.{8,50}$/, {
    message: "Password length",
  })
  password!: string;

  @Field({ nullable: true })
  image?: ObjectID;
}

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  @Length(3, 50)
  firstname?: string;

  @Field({ nullable: true })
  @Length(3, 50)
  lastname?: string;

  @Field({ nullable: true })
  @Length(3, 50)
  nickname?: string;

  @Field({ nullable: true })
  image?: ObjectID;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  currentPassword: string;

  @Field()
  newPassword: string;
}
