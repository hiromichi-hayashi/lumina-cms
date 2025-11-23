import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { DrizzleService } from '../../../db/drizzle.service';
import { sessions, Session, NewSession } from '../../../db/schema';
import { eq, lt, gt, and } from 'drizzle-orm';

/**
 * Session Repository
 *
 * セッションテーブルへのデータアクセスを担当します。
 * セッション管理とクリーンアップ操作を提供します。
 */
@Injectable()
export class SessionRepository extends BaseRepository<typeof sessions, Session, NewSession> {
  constructor(drizzleService: DrizzleService) {
    super(drizzleService, sessions);
  }

  /**
   * セッショントークンでセッション検索
   * Better Auth CLIスキーマ: tokenフィールド
   */
  async findByToken(sessionToken: string): Promise<Session | undefined> {
    return this.findOne(eq(this.table.token, sessionToken));
  }

  /**
   * ユーザーIDで全セッション取得
   */
  async findByUserId(userId: string): Promise<Session[]> {
    return this.findMany(eq(this.table.userId, userId));
  }

  /**
   * ユーザーIDでアクティブなセッション取得
   */
  async findActiveByUserId(userId: string): Promise<Session[]> {
    return this.findMany(
      and(eq(this.table.userId, userId), gt(this.table.expiresAt, new Date())) as any,
    );
  }

  /**
   * 期限切れセッション削除
   * @returns 削除されたセッション数
   */
  async deleteExpired(): Promise<number> {
    const deleted = await this.delete(lt(this.table.expiresAt, new Date()));
    return deleted.length;
  }

  /**
   * ユーザーIDで全セッション削除（ログアウト）
   */
  async deleteByUserId(userId: string): Promise<number> {
    const deleted = await this.delete(eq(this.table.userId, userId));
    return deleted.length;
  }

  /**
   * セッショントークンでセッション削除
   */
  async deleteByToken(sessionToken: string): Promise<Session | undefined> {
    const deleted = await this.delete(eq(this.table.token, sessionToken));
    return deleted[0];
  }

  /**
   * アクティブなセッション数をカウント
   */
  async countActive(): Promise<number> {
    return this.count(gt(this.table.expiresAt, new Date()));
  }

  /**
   * ユーザーのアクティブセッション数をカウント
   */
  async countActiveByUserId(userId: string): Promise<number> {
    return this.count(
      and(eq(this.table.userId, userId), gt(this.table.expiresAt, new Date())) as any,
    );
  }

  /**
   * セッションが有効かチェック
   */
  async isSessionValid(sessionToken: string): Promise<boolean> {
    const session = await this.findByToken(sessionToken);
    if (!session) {
      return false;
    }
    return session.expiresAt > new Date();
  }

  /**
   * セッションの有効期限を延長
   */
  async extendSession(sessionToken: string, expiresAt: Date): Promise<Session | undefined> {
    const session = await this.findByToken(sessionToken);
    if (!session) {
      return undefined;
    }
    const updated = await this.update(eq(this.table.token, sessionToken), {
      expiresAt: expiresAt,
    });
    return updated[0];
  }

  /**
   * 指定日時より古いセッションを削除
   */
  async deleteOlderThan(date: Date): Promise<number> {
    const deleted = await this.delete(lt(this.table.createdAt, date));
    return deleted.length;
  }
}
