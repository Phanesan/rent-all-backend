import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(graphqlUploadExpress.default({ maxFileSize: 200000000, maxFiles: 10 }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
