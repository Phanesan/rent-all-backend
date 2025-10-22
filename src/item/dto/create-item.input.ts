import { InputType, Field } from '@nestjs/graphql';
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


}
