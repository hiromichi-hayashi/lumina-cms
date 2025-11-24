import { SetMetadata } from '@nestjs/common';

/**
 * ロールのメタデータキー
 */
export const ROLES_KEY = 'roles';

/**
 * Rolesデコレーター
 *
 * エンドポイントにアクセスできるロールを指定します。
 * RolesGuardと併用することで、ロールベースのアクセス制御が可能になります。
 *
 * 使用例:
 * ```typescript
 * @UseGuards(AuthGuard, RolesGuard)
 * @Roles('admin')
 * @Get('admin-only')
 * adminOnlyEndpoint() {
 *   return { message: 'Admin access granted' };
 * }
 *
 * // 複数ロール指定
 * @UseGuards(AuthGuard, RolesGuard)
 * @Roles('admin', 'member')
 * @Get('users')
 * getAllUsers() {
 *   return { users: [] };
 * }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
