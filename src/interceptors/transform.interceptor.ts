import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
     console.log('TransformInterceptor 1');
     // console.log('TransformInterceptor context', context);
     console.log('TransformInterceptor next', next);
     console.log('TransformInterceptor 2');
    return next
    .handle()
    .pipe(
        map((data: any) => {
            
            return { data: data };
        })
    );
  }
}