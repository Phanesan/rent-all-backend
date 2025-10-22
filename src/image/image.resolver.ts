import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';

@Resolver(() => Image)
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Mutation(() => [Image])
  async addImages(
    @Args('itemId') itemId: string,
    @Args({ name: 'files', type: () => [GraphQLUpload] })
    files: Promise<FileUpload>[],
  ): Promise<Image[]> {
    const resolvedFiles = await Promise.all(files);
    return this.imageService.addImages(itemId, resolvedFiles);
  }
}
