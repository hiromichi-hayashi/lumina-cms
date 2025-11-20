import { BadRequestException } from '@nestjs/common';
import { ZodValidationPipe } from '../../../../src/common/pipes/zod-validation.pipe';
import { z } from 'zod';

describe('ZodValidationPipe', () => {
  describe('バリデーション成功', () => {
    it('正しいデータで検証をパスすること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
        password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください' }),
      });

      const pipe = new ZodValidationPipe(schema);
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      // Act
      const result = pipe.transform(validData);

      // Assert
      expect(result).toEqual(validData);
    });

    it('パース済みデータが返されること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        age: z.number().optional(),
      });

      const pipe = new ZodValidationPipe(schema);
      const validData = {
        email: 'user@example.com',
        password: 'SecurePassword123',
      };

      // Act
      const result = pipe.transform(validData);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('email', 'user@example.com');
      expect(result).toHaveProperty('password', 'SecurePassword123');
    });

    it('追加のフィールドがあっても検証をパスすること（strict: falseの場合）', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
      });

      const pipe = new ZodValidationPipe(schema);
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        extraField: 'extra',
      };

      // Act
      const result = pipe.transform(validData);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('email', 'test@example.com');
    });

    it('オプショナルフィールドがなくても検証をパスすること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().optional(),
      });

      const pipe = new ZodValidationPipe(schema);
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      // Act
      const result = pipe.transform(validData);

      // Assert
      expect(result).toEqual(validData);
    });
  });

  describe('バリデーション失敗', () => {
    it('無効なデータでBadRequestExceptionが発生すること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
        password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください' }),
      });

      const pipe = new ZodValidationPipe(schema);
      const invalidData = {
        email: 'invalid-email',
        password: 'short',
      };

      // Act & Assert
      expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
    });

    it('BadRequestException("バリデーションエラー")が発生すること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
      });

      const pipe = new ZodValidationPipe(schema);
      const invalidData = {
        email: 'invalid-email',
        password: 'short',
      };

      // Act & Assert
      try {
        pipe.transform(invalidData);
        fail('Expected BadRequestException to be thrown');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(BadRequestException);
        if (error instanceof BadRequestException) {
          expect(error.getResponse()).toEqual(
            expect.objectContaining({
              message: 'バリデーションエラー',
              errors: expect.any(Array),
            }),
          );
        }
      }
    });

    it('エラー詳細が含まれること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
        password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください' }),
      });

      const pipe = new ZodValidationPipe(schema);
      const invalidData = {
        email: 'invalid-email',
        password: 'short',
      };

      // Act & Assert
      try {
        pipe.transform(invalidData);
        fail('Expected BadRequestException to be thrown');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(BadRequestException);
        if (error instanceof BadRequestException) {
          const response = error.getResponse() as { errors?: unknown[] };
          expect(response.errors).toBeDefined();
          expect(response.errors?.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('メールアドレス形式チェック', () => {
    it('無効なメール形式で失敗すること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
      });

      const pipe = new ZodValidationPipe(schema);
      const invalidData = {
        email: 'not-an-email',
      };

      // Act & Assert
      expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
    });

    it('@なしのメールアドレスで失敗すること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email(),
      });

      const pipe = new ZodValidationPipe(schema);
      const invalidData = {
        email: 'invalid.email.com',
      };

      // Act & Assert
      expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
    });

    it('ドメインなしのメールアドレスで失敗すること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email(),
      });

      const pipe = new ZodValidationPipe(schema);
      const invalidData = {
        email: 'user@',
      };

      // Act & Assert
      expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
    });

    it('有効なメールアドレスで成功すること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email(),
      });

      const pipe = new ZodValidationPipe(schema);
      const validData = {
        email: 'valid@example.com',
      };

      // Act
      const result = pipe.transform(validData);

      // Assert
      expect(result).toHaveProperty('email', 'valid@example.com');
    });
  });

  describe('パスワード最小長チェック', () => {
    it('8文字未満のパスワードで失敗すること', () => {
      // Arrange
      const schema = z.object({
        password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください' }),
      });

      const pipe = new ZodValidationPipe(schema);
      const invalidData = {
        password: 'short',
      };

      // Act & Assert
      expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
    });

    it('7文字のパスワードで失敗すること', () => {
      // Arrange
      const schema = z.object({
        password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください' }),
      });

      const pipe = new ZodValidationPipe(schema);
      const invalidData = {
        password: '1234567',
      };

      // Act & Assert
      expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
    });

    it('8文字のパスワードで成功すること', () => {
      // Arrange
      const schema = z.object({
        password: z.string().min(8),
      });

      const pipe = new ZodValidationPipe(schema);
      const validData = {
        password: '12345678',
      };

      // Act
      const result = pipe.transform(validData);

      // Assert
      expect(result).toHaveProperty('password', '12345678');
    });

    it('8文字以上のパスワードで成功すること', () => {
      // Arrange
      const schema = z.object({
        password: z.string().min(8),
      });

      const pipe = new ZodValidationPipe(schema);
      const validData = {
        password: 'VerySecurePassword123',
      };

      // Act
      const result = pipe.transform(validData);

      // Assert
      expect(result).toHaveProperty('password', 'VerySecurePassword123');
    });
  });

  describe('複合バリデーション', () => {
    it('複数のフィールドで複数のエラーが発生すること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
        password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください' }),
        age: z.number().min(0),
      });

      const pipe = new ZodValidationPipe(schema);
      const invalidData = {
        email: 'invalid-email',
        password: 'short',
        age: -1,
      };

      // Act & Assert
      expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
    });

    it('必須フィールドが欠けている場合にエラーが発生すること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
      });

      const pipe = new ZodValidationPipe(schema);
      const invalidData = {
        email: 'test@example.com',
        // password is missing
      };

      // Act & Assert
      expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
    });

    it('データ型が間違っている場合にエラーが発生すること', () => {
      // Arrange
      const schema = z.object({
        email: z.string().email(),
        age: z.number(),
      });

      const pipe = new ZodValidationPipe(schema);
      const invalidData = {
        email: 'test@example.com',
        age: 'not-a-number',
      };

      // Act & Assert
      expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
    });
  });

  describe('実際のサインインスキーマテスト', () => {
    it('signInSchemaと同じスキーマで有効なデータが検証をパスすること', () => {
      // Arrange
      const signInSchema = z.object({
        email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
        password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください' }),
      });

      const pipe = new ZodValidationPipe(signInSchema);
      const validData = {
        email: 'user@example.com',
        password: 'Password123',
      };

      // Act
      const result = pipe.transform(validData);

      // Assert
      expect(result).toEqual(validData);
    });

    it('signInSchemaと同じスキーマで無効なデータがエラーを発生させること', () => {
      // Arrange
      const signInSchema = z.object({
        email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
        password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください' }),
      });

      const pipe = new ZodValidationPipe(signInSchema);
      const invalidData = {
        email: 'invalid',
        password: 'short',
      };

      // Act & Assert
      expect(() => pipe.transform(invalidData)).toThrow(BadRequestException);
    });
  });
});
