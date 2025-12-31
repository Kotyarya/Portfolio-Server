import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {join} from 'path';
import * as express from 'express';
import {AllExceptionsFilter} from './common/AllExceptionsFilter.filter';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.use('/static_media', express.static(join(__dirname, '..', 'media')));

    await app.listen(process.env.PORT ?? 5000, "0.0.0.0");
}

bootstrap();
