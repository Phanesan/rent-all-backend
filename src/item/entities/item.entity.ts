import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Rental } from '../../rental/entities/rental.entity';
import { Image } from '../../image/entities/image.entity';

@ObjectType()
@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column('text')
  @Field()
  description: string;

  @OneToMany(() => Image, (image) => image.item, { cascade: true, eager: true })
  @Field(() => [Image], { nullable: true })
  images?: Image[];

  @Column({ default: false })
  @Field()
  isRented: boolean;

  @ManyToOne(() => User, (user) => user.items, { eager: true })
  @Field(() => User)
  user: User;

  @OneToMany(() => Rental, (rental) => rental.item)
  @Field(() => [Rental], { nullable: true })
  rentals?: Rental[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
