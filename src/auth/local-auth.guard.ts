import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    // local strategy 실행 트리거
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    // serializer 실행 트리거
    await super.logIn(request);
    return result;
  }
}
