import { Module, Global } from '@nestjs/common';
import { RolesGuard } from './guards/roles';

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
 *
 * NOTE: AuthGuardはBETTER_AUTHプロバイダーに依存するため、AuthModuleに配置されています。
 * AuthGuardを使用する場合は、モジュールでAuthModuleをインポートしてください。
 *
 * NOTE: ZodValidationPipeはパラメータ化パイプのため、DIコンテナで管理されません。
 * 各エンドポイントで直接インスタンス化してください: @Body(new ZodValidationPipe(schema))
 */
@Global()
@Module({
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class CommonModule {}
