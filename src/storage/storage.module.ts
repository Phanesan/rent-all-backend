import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { StorageService } from './storage.service';
import { StorageResolver } from './storage.resolver';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.getOrThrow<string>('MINIO_ENDPOINT'),
        port: parseInt(configService.getOrThrow<string>('MINIO_PORT')),
        accessKey: configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
        secretKey: configService.getOrThrow<string>('MINIO_SECRET_KEY'),
        useSSL: configService.getOrThrow<string>('MINIO_USE_SSL') === 'true',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [StorageService, StorageResolver],
  exports: [StorageService],
})
export class StorageModule {}
