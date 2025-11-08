import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Item } from '../../item/entities/item.entity';

@ObjectType()
@Entity()
export class Rental {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => Item, (item) => item.rentals)
  @Field(() => Item)
  item: Item;

  @ManyToOne(() => User, (user) => user.rentals)
  @Field(() => User)
  user: User;

  @Column()
  @Field()
  startDate: Date;

  @Column()
  @Field()
  endDate: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
