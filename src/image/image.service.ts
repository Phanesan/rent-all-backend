import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { StorageService, GqlFileUpload } from '../storage/storage.service';
import { ItemService } from '../item/item.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly storageService: StorageService,
    private readonly itemService: ItemService,
  ) {}

  async addImages(
    itemId: string,
    files: GqlFileUpload[],
  ): Promise<Image[]> {
    const item = await this.itemService.findOne(itemId);
    if (!item) {
      throw new NotFoundException(`Item with ID "${itemId}" not found`);
    }

    const uploadedFiles = await this.storageService.uploadMany(files);

    const images = uploadedFiles.map(({ url }) => {
      return this.imageRepository.create({
        url,
        item,
      });
    });

    return this.imageRepository.save(images);
  }
}
