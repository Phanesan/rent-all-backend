import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { StorageService } from './storage.service';
import { FileUploadResponse } from './dto/file-upload.output';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';

@Resolver()
export class StorageResolver {
  constructor(private readonly storageService: StorageService) {}

  @Mutation(() => FileUploadResponse)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
  ): Promise<FileUploadResponse> {
    const { path, url } = await this.storageService.upload(file);
    return {
      path,
      url,
      success: true,
      message: 'Archivo subido exitosamente.',
    };
  }

  @Mutation(() => [FileUploadResponse])
  async uploadFiles(
    @Args({ name: 'files', type: () => [GraphQLUpload] })
    files: Promise<FileUpload>[],
  ): Promise<FileUploadResponse[]> {
    const resolvedFiles = await Promise.all(files);
    const uploadedFiles = await this.storageService.uploadMany(resolvedFiles);
    return uploadedFiles.map((file) => ({ ...file, success: true }));

  }
}
