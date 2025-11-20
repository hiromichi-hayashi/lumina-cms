import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';

/**
 * CommonModule
 *
 * アプリケーション全体で共有される横断的機能を提供します。
 * - Guards: 認証・認可ガード
 * - Decorators: カスタムデコレーター
 * - Pipes: バリデーションパイプ
 * - Interceptors: インターセプター（将来）
 * - Filters: 例外フィルター（将来）
 *
 * NestJS公式推奨のベストプラクティスに従い、
 * 複数のモジュールで再利用される共通機能をここに集約します。
 */
@Module({
  providers: [AuthGuard, RolesGuard, ZodValidationPipe],
  exports: [AuthGuard, RolesGuard, ZodValidationPipe],
})
export class CommonModule {}
