import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * CurrentUserデコレーター
 *
 * リクエストから現在のユーザー情報を取得します。
 * AuthGuardと併用することで、認証されたユーザー情報にアクセスできます。
 *
 * 使用例:
 * ```typescript
 * @UseGuards(AuthGuard)
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 *
 * // 特定のフィールドのみ取得
 * @UseGuards(AuthGuard)
 * @Get('email')
 * getEmail(@CurrentUser('email') email: string) {
 *   return { email };
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // フィールド指定がある場合はそのフィールドを返す
    return data ? user?.[data] : user;
  },
);
