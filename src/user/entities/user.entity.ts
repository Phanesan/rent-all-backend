import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

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
}
