import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AvailabilityResponse {
  @Field()
  available: boolean;
}
