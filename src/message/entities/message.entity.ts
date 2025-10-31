import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType({ description: 'Represents a single message between two users' })
@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  senderId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'senderId' })
  @Field(() => User)
  sender: User;

  @Column()
  receiverId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'receiverId' })
  @Field(() => User)
  receiver: User;

  @Column('text')
  @Field()
  content: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  
  @Field()
  timestamp: Date;
}
