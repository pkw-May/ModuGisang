import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { filterSensitiveInfo } from '../../utils/filter.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    // 민감 정보 필터링 적용
    const filteredBody = filterSensitiveInfo(request.body);
    const filteredHeaders = filterSensitiveInfo(request.headers);

    this.logger.error(
      `Http Status: ${status} Error Message: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    // 요청 관련 정보 로깅
    this.logger.log(`Request Method: ${request.method}`);
    this.logger.log(`Request URL: ${request.url}`);
    this.logger.log(`Request Headers: ${JSON.stringify(filteredHeaders)}`);
    this.logger.log(`Request Body: ${JSON.stringify(filteredBody)}`);

    // 예외 응답 전송
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
