import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateItemInput } from './create-item.input';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {

  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  isRented?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  imageIds?: string[];

  @Field({ nullable: true })
  @IsArray()
  rentalIds?: string[];
}
