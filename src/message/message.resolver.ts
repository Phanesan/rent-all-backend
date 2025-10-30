import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => Message, { name: 'createMessage' })
  createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
  ) {
    return this.messageService.create(createMessageInput);
  }

  @Query(() => [Message], { name: 'messagesByUser' })
  findAllByUser(@Args('userId', { type: () => String }) userId: string) {
    return this.messageService.findAllByUser(userId);
  }
}

