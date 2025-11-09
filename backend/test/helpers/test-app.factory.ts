import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

/**
 * テスト用NestJSアプリケーションファクトリー
 *
 * E2Eテストで使用するアプリケーションインスタンスを作成します
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // 本番環境と同じValidationPipeを設定
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  console.log('🚀 テスト用アプリケーションを起動しました');

  return app;
}

/**
 * テスト用アプリケーションのクローズ
 */
export async function closeTestApp(app: INestApplication): Promise<void> {
  if (app) {
    await app.close();
    console.log('👋 テスト用アプリケーションをクローズしました');
  }
}
