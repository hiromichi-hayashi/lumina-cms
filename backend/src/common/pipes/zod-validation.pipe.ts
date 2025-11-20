import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { z } from 'zod';

/**
 * Zodバリデーションパイプ
 *
 * Zodスキーマを使用してリクエストボディのバリデーションを行います。
 *
 * 使用例:
 * ```typescript
 * @Post('signin')
 * async signIn(@Body(new ZodValidationPipe(signInSchema)) dto: SignInDto) {
 *   // ...
 * }
 * ```
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodTypeAny) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'バリデーションエラー',
          errors: error.issues,
        });
      }
      throw new BadRequestException('バリデーションエラー');
    }
  }
}
