import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const resp = isHttp ? exception.getResponse() : { message: 'Internal server error' };

    const message =
      typeof resp === 'string'
        ? resp
        : (resp as any)?.message ?? 'Error';

    res.status(status).json({
      statusCode: status,
      method: req.method,
      path: req.url,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
