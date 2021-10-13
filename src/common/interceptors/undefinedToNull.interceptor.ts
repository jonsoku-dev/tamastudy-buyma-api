import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 전 부분
    return (
      next
        .handle()
        // JSON 은 undefiend 를 모른다. null 만 취급한다. 그러므로 예상치못한 에러가 발생할 수 있다.
        .pipe(map((data) => (data === undefined ? null : data)))
    );
  }
}
