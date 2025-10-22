import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Item } from '../../item/entities/item.entity';
import { Rental } from '../../rental/entities/rental.entity';

@ObjectType()
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'text', nullable: false })
  @Field(() => String)
  name: string;

  @Column({ type: 'text', unique: true, nullable: false })
  @Field(() => String)
  email: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  address?: string;

  @Column({ type: 'text', nullable: false })
  @Field(() => String)
  phone: string;

  @Column({ name: 'postal_code', type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  postalCode?: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => Item, (item) => item.user)
  @Field(() => [Item], { nullable: true })
  items?: Item[];

  @OneToMany(() => Rental, (rental) => rental.user)
  @Field(() => [Rental], { nullable: true })
  rentals?: Rental[];
}
