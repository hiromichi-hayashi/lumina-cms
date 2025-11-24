import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ServerConfig } from './config/server';

async function bootstrap() {
  // Better Authが独自にBody Parsingを行うため、NestJSのBody Parserを無効化
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const configService = app.get(ConfigService);
  const serverConfig = configService.get<ServerConfig>('server');

  // セキュリティヘッダー
  if (serverConfig.helmet.enabled) {
    app.use(helmet());
  }

  // 圧縮
  if (serverConfig.compression.enabled) {
    app.use(compression());
  }

  // Cookie Parser
  if (serverConfig.cookieParser.enabled) {
    app.use(cookieParser());
  }

  // グローバルバリデーション
  app.useGlobalPipes(new ValidationPipe(serverConfig.validation));

  // CORS設定
  app.enableCors({
    origin: serverConfig.cors.allowedOrigins,
    credentials: serverConfig.cors.credentials,
  });

  // グローバルプレフィックス
  app.setGlobalPrefix(serverConfig.globalPrefix);

  // Swagger設定
  if (serverConfig.swagger.enabled) {
    const config = new DocumentBuilder()
      .setTitle(serverConfig.swagger.title)
      .setDescription(serverConfig.swagger.description)
      .setVersion(serverConfig.swagger.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(serverConfig.swagger.path, app, document);
  }

  const port = configService.get<number>('app.port', 3001);
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger UI: http://localhost:${port}/${serverConfig.swagger.path}`);
}

bootstrap();
