import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';

import { ImageService } from './image.service';
import { ImageResolver } from './image.resolver';

import { StorageModule } from '../storage/storage.module';
import { ItemModule } from '../item/item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), StorageModule, ItemModule],
  providers: [ImageService, ImageResolver],
  exports: [ImageService],
})
export class ImageModule {}
