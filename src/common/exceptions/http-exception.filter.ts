
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException | Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        // 500 에러 처리 가능하도록 HttpException 외에 Error 추가, status 및 error도 수정
        //const status = exception.getStatus();
        //const error = exception.getResponse() as | string | { error: string; statusCode: number; message: string | string[] };
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const error =
            exception instanceof HttpException
                ? (exception.getResponse() as string | { error: string; statusCode: number; message: string | string[] })
                : exception.message;

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