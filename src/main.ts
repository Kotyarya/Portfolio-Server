import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {AppModule} from './app.module';
import {AllExceptionsFilter} from './common/AllExceptionsFilter.filter';
import {createValidationPipe} from './common/validation.pipe';
import {securityHeaders} from './common/security-headers.middleware';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.set('trust proxy', 1);
    app.use(securityHeaders);
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    const port = Number(process.env.PORT) || 3000;
    await app.listen(port, "0.0.0.0");
}

void bootstrap();
