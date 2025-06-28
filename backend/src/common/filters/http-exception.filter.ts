import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseHelper } from '../helpers/response.helper';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    const message = exceptionResponse.message || 'An error occurred';
    const errors = Array.isArray(message) ? message.map(m => ({ message: m })) : [{ message }];

    response.status(status).json(ResponseHelper.error(message, errors));
  }
}
