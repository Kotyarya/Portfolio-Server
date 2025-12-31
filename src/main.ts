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
    const port = Number(process.env.PORT) || 3000;
    await app.listen(port, "0.0.0.0");
}

bootstrap();
