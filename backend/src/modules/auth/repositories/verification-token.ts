import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/repositories/base';
import { DrizzleService } from '../../../db/drizzle.service';
import { verificationTokens, VerificationToken, NewVerificationToken } from '../../../db/schema';
import { eq, lt, and } from 'drizzle-orm';

/**
 * Verification Token Repository
 *
 * 検証トークンテーブルへのデータアクセスを担当します。
 * メール確認やパスワードリセットトークンの管理を提供します。
 */
@Injectable()
export class VerificationTokenRepository extends BaseRepository<
  typeof verificationTokens,
  VerificationToken,
  NewVerificationToken
> {
  constructor(drizzleService: DrizzleService) {
    super(drizzleService, verificationTokens);
  }

  /**
   * トークンで検証トークン検索
   * Better Auth CLIスキーマ: valueフィールド
   */
  async findByToken(token: string): Promise<VerificationToken | undefined> {
    return this.findOne(eq(this.table.value, token));
  }

  /**
   * 識別子（メールアドレス等）でトークン検索
   */
  async findByIdentifier(identifier: string): Promise<VerificationToken[]> {
    return this.findMany(eq(this.table.identifier, identifier));
  }

  /**
   * 識別子とトークンで検索
   */
  async findByIdentifierAndToken(
    identifier: string,
    token: string,
  ): Promise<VerificationToken | undefined> {
    // Drizzle ORMの型制約: and()の戻り値型がSQL型と互換性がないため`as any`が必要
    return this.findOne(
      and(eq(this.table.identifier, identifier), eq(this.table.value, token)) as any,
    );
  }

  /**
   * トークンが有効かチェック
   */
  async isTokenValid(token: string): Promise<boolean> {
    const verificationToken = await this.findByToken(token);
    if (!verificationToken) {
      return false;
    }
    return verificationToken.expiresAt > new Date();
  }

  /**
   * 期限切れトークン削除
   * @returns 削除されたトークン数
   */
  async deleteExpired(): Promise<number> {
    const deleted = await this.delete(lt(this.table.expiresAt, new Date()));
    return deleted.length;
  }

  /**
   * 識別子で全トークン削除
   */
  async deleteByIdentifier(identifier: string): Promise<number> {
    const deleted = await this.delete(eq(this.table.identifier, identifier));
    return deleted.length;
  }

  /**
   * トークンで削除
   */
  async deleteByToken(token: string): Promise<VerificationToken | undefined> {
    const deleted = await this.delete(eq(this.table.value, token));
    return deleted[0];
  }

  /**
   * 識別子とトークンで削除
   */
  async deleteByIdentifierAndToken(
    identifier: string,
    token: string,
  ): Promise<VerificationToken | undefined> {
    // Drizzle ORMの型制約: and()の戻り値型がSQL型と互換性がないため`as any`が必要
    const deleted = await this.delete(
      and(eq(this.table.identifier, identifier), eq(this.table.value, token)) as any,
    );
    return deleted[0];
  }

  /**
   * トークンを検証して削除（ワンタイム検証）
   * トークンが有効な場合のみ削除し、結果を返す
   */
  async verifyAndConsume(identifier: string, token: string): Promise<VerificationToken | null> {
    const verificationToken = await this.findByIdentifierAndToken(identifier, token);

    if (!verificationToken) {
      return null;
    }

    // 期限切れチェック
    if (verificationToken.expiresAt < new Date()) {
      // 期限切れトークンは削除
      await this.deleteByToken(token);
      return null;
    }

    // 有効なトークンを削除（ワンタイム使用）
    await this.deleteByToken(token);
    return verificationToken;
  }

  /**
   * 指定日時より古いトークンを削除
   */
  async deleteOlderThan(date: Date): Promise<number> {
    const deleted = await this.delete(lt(this.table.createdAt, date));
    return deleted.length;
  }

  /**
   * 識別子の有効なトークン数をカウント
   */
  async countValidByIdentifier(identifier: string): Promise<number> {
    const tokens = await this.findByIdentifier(identifier);
    const validTokens = tokens.filter((token) => token.expiresAt > new Date());
    return validTokens.length;
  }
}
