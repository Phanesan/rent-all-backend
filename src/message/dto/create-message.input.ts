import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;
}
