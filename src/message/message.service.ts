import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageInput: CreateMessageInput): Promise<Message> {
    const newMessage = this.messageRepository.create(createMessageInput);
    return this.messageRepository.save(newMessage);
  }

  async findAllByUser(userId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: {
        timestamp: 'ASC',
      },
    });
  }
}
