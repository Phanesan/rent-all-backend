import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateItemInput } from './create-item.input';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {

  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  isRented?: boolean;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;
}
