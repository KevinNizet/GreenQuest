import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Field()
  mimetype!: string;

  @Column()
  // @Field()
  path!: string;

  @Column()
  // @Field()
  originalName!: string;

  @Field()
  get uri(): string {
    return `/images/${this.id}`;
  }
}
