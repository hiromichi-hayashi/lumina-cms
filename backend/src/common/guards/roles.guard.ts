import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * ロールガード
 *
 * ユーザーが必要なロールを持っているかをチェックし、
 * 権限がない場合はForbiddenExceptionをスローします。
 *
 * 使用例:
 * ```typescript
 * @UseGuards(AuthGuard, RolesGuard)
 * @Roles('admin')
 * @Get('admin-only')
 * adminOnlyEndpoint() {
 *   return { message: 'Admin access granted' };
 * }
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // デコレーターから必要なロールを取得
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ロール指定がない場合は通過
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // ユーザー情報がない場合（AuthGuardが先に実行される前提）
    if (!user) {
      this.logger.warn('User not found in request. Make sure AuthGuard is applied first.');
      throw new ForbiddenException('ユーザー情報が見つかりません');
    }

    // ユーザーのロールをチェック
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      this.logger.debug(
        `User ${user.id} with role "${user.role}" tried to access endpoint requiring roles: ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException('このリソースにアクセスする権限がありません');
    }

    return true;
  }
}
