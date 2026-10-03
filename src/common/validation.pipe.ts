import {ValidationPipe, type ValidationPipeOptions} from '@nestjs/common';

export const validationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: false,
  },
};

export const createValidationPipe = () =>
  new ValidationPipe(validationPipeOptions);
