import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = (error instanceof HttpException) ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = 'Exception Log Message';
    console.log(`Filter exception status:`, status);
    console.log(`Filter exception message:`, message);

    response
      .status(status)
      .json({
        statusCode: status,
        error: error,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
  }
}