
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const error = exception.getResponse() as | string | { error: string; statusCode: number; message: string | string[] };

        if ( typeof error === 'string' ) { // 코드에서 발생시킨 에러
            response
                .status(status)
                .json({
                    success: false,
                    statusCode: status,
                    message: error,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
        } else { // nestjs에서 발생한 에러 (404 등)
            response
                .status(status)
                .json({
                    success: false,
                    statusCode: status,
                    ...error,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
        }
    }
}