import { InputType, Field, ID } from '@nestjs/graphql';
import { IsArray, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  imageIds?: string[];
}
