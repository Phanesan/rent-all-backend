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

  async findAllByUser(
    userId: string,
    page: number,
    limit: number,
    receiverId?: string,
  ): Promise<Message[]> {
    const queryOptions: any = {
      where: receiverId
        ? [
            { senderId: userId, receiverId: receiverId },
            { senderId: receiverId, receiverId: userId },
          ]
        : [{ senderId: userId }, { receiverId: userId }],
      order: {
        timestamp: 'DESC',
      },
    };

    if (limit !== 0) {
      queryOptions.take = limit;
      queryOptions.skip = (page - 1) * limit;
    }

    return this.messageRepository.find(queryOptions);
  }
}
