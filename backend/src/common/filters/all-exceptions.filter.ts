import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Request, Response } from 'express';

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
    const filteredBody = this.filterSensitiveInfo(request.body);
    const filteredHeaders = this.filterSensitiveInfo(request.headers);

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

  filterSensitiveInfo(data: any) {
    const fieldsToMask = ['password', 'token', 'cookie'];
    const maskedData = { ...data };

    for (const field of fieldsToMask) {
      if (maskedData[field]) {
        maskedData[field] = '****'; // 민감 정보 마스킹
      }
    }

    return maskedData;
  }
}
