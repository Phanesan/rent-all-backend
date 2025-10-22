import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FileUploadResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  path?: string;

  @Field({ nullable: true })
  url?: string;
}
