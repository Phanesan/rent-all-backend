import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  address?: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field()
  password: string;

}
