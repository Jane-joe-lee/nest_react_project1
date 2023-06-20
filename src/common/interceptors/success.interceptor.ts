import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        //console.log('Before...');
        const now = Date.now();
        return next
            .handle()
            .pipe(
                //tap(() => console.log(`After... ${Date.now() - now}ms`)),
                map((data) => ({
                    success: true,
                    data
                }))
            );
        // map은 rxjs에서 나온 것.
        // controller에서 리턴한 값을 map(data)=>여기서 data로 받음
    }
}