import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsUUID } from 'class-validator';

@InputType()
export class CreateRentalInput {
  @Field()
  @IsDate()
  startDate: Date;

  @Field()
  @IsDate()
  endDate: Date;

  @Field()
  @IsUUID()
  itemId: string;

  @Field()
  @IsUUID()
  userId: string;
}
