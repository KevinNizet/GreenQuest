import { ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  token!: string;

  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn()
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
