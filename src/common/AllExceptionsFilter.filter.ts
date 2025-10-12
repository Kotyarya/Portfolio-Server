import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let errorMessage: string;
    if (typeof message === 'string') {
      errorMessage = message;
    } else if (
      typeof message === 'object' &&
      message !== null &&
      'message' in message
    ) {
      const msg = (message as Record<string, unknown>).message;
      if (Array.isArray(msg)) {
        errorMessage = msg.join('; ');
      } else if (typeof msg === 'string') {
        errorMessage = msg;
      } else {
        errorMessage = 'Unexpected error';
      }
    } else {
      errorMessage = 'Unexpected error';
    }

    console.error(
      `[${new Date().toISOString()}] ❌ ${status} ${req.method} ${req.url}`,
    );
    console.error('Message:', errorMessage);
    if (!(exception instanceof HttpException)) {
      if (
        typeof exception === 'object' &&
        exception !== null &&
        'stack' in exception
      ) {
        console.error('Stack:', (exception as { stack?: unknown }).stack);
      }
    }

    res.status(status).json({
      status: status,
      message: errorMessage,
      data: null,
    });
  }
}
