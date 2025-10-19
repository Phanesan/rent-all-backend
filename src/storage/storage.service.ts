import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as crypto from 'crypto';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

export interface GqlFileUpload {
  createReadStream: () => NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
  encoding: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucketName: string;

  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET_NAME');
    this.ensureBucketExists();
    this.logger.log(`Almacenamiento inicializado. Usando bucket: ${this.bucketName}`);
  }

  private async ensureBucketExists() {
    const client = this.minioService.client;
    try {
      const bucketExists = await client.bucketExists(this.bucketName);
      if (!bucketExists) {
        this.logger.log(
          `Bucket "${this.bucketName}" no encontrado. Creándolo...`,
        );
        await client.makeBucket(this.bucketName, 'mx-bcs-1');
        this.logger.log(`Bucket "${this.bucketName}" creado exitosamente.`);

        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                AWS: ['*'],
              },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await client.setBucketPolicy(this.bucketName, JSON.stringify(policy));
        this.logger.log(`Política de acceso público configurada para el bucket "${this.bucketName}".`);
      }
    } catch (error) {
      this.logger.error('Error al verificar o crear el bucket:', error);
      throw new HttpException('Error al inicializar el storage', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  public async upload(
    file: GqlFileUpload,
  ): Promise<{ path: string; url: string }> {
    const { createReadStream, filename, mimetype } = file;

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    if (!allowedMimeTypes.includes(mimetype)) {
      throw new HttpException(
        `[${mimetype}] Tipo de archivo no soportado. Tipos permitidos: ${allowedMimeTypes.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Generar un nombre de archivo único para evitar colisiones.
    const hashedFileName = crypto.randomUUID();

    // Usar el módulo 'path' para obtener la extensión de forma segura.
    const extension = path.extname(filename);

    const metaData = {
      'Content-Type': mimetype,
    };

    const fileName = hashedFileName + extension;

    try {
      await this.minioService.client.putObject(
        this.bucketName,
        fileName,
        await this.streamToBuffer(createReadStream()),
        metaData,
      );

      const url = `http://${this.configService.get<string>(
        'MINIO_ENDPOINT',
      )}:${this.configService.get<string>('MINIO_PORT')}/${this.bucketName}/${fileName}`;

      return {
        path: fileName,
        url: url,
      };
    } catch (error) {
      this.logger.error(`Error al subir el archivo: ${fileName}`, error);
      throw new HttpException(
        'Error al subir el archivo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async uploadMany(
    files: GqlFileUpload[],
  ): Promise<{ path: string; url: string }[]> {
    const uploadPromises = files.map((file) => this.upload(file));
    const results = await Promise.all(uploadPromises);
    return results;
  }
}
