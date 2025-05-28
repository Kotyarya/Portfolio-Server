import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/static_media', express.static(join(__dirname, '..', 'media')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
