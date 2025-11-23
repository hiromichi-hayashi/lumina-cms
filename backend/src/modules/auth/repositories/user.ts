import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { DrizzleService } from '../../../db/drizzle.service';
import { users, User, NewUser } from '../../../db/schema';
import { eq, and, isNull, not, gt } from 'drizzle-orm';

/**
 * User Repository
 *
 * ユーザーテーブルへのデータアクセスを担当します。
 * 認証関連の特化したクエリ操作を提供します。
 */
@Injectable()
export class UserRepository extends BaseRepository<typeof users, User, NewUser> {
  constructor(drizzleService: DrizzleService) {
    super(drizzleService, users);
  }

  /**
   * メールアドレスでユーザー検索
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne(eq(this.table.email, email));
  }

  /**
   * メールアドレスの存在チェック
   */
  async existsByEmail(email: string): Promise<boolean> {
    return this.exists(eq(this.table.email, email));
  }

  /**
   * アクティブなユーザーのみ取得
   */
  async findActiveUsers(): Promise<User[]> {
    return this.findMany(eq(this.table.isActive, true));
  }

  /**
   * ロックされているユーザー取得
   * lockedUntilが現在時刻より未来のユーザーを返す
   */
  async findLockedUsers(): Promise<User[]> {
    return this.findMany(
      and(not(isNull(this.table.lockedUntil)), gt(this.table.lockedUntil, new Date())) as any,
    );
  }

  /**
   * ユーザーがロックされているかチェック
   */
  async isUserLocked(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user || !user.lockedUntil) {
      return false;
    }
    return user.lockedUntil > new Date();
  }

  /**
   * ログイン試行回数をインクリメント
   */
  async incrementLoginAttempts(userId: string): Promise<User | undefined> {
    const user = await this.findById(userId);
    if (!user) {
      return undefined;
    }
    return this.updateById(userId, {
      loginAttempts: user.loginAttempts + 1,
    });
  }

  /**
   * ログイン試行回数をリセット
   */
  async resetLoginAttempts(userId: string): Promise<User | undefined> {
    return this.updateById(userId, {
      loginAttempts: 0,
      lockedUntil: null,
    });
  }

  /**
   * ユーザーをロック
   */
  async lockUser(userId: string, lockDurationMinutes: number = 30): Promise<User | undefined> {
    const lockedUntil = new Date();
    lockedUntil.setMinutes(lockedUntil.getMinutes() + lockDurationMinutes);

    return this.updateById(userId, {
      lockedUntil,
    });
  }

  /**
   * 最終ログイン日時を更新
   */
  async updateLastLogin(userId: string): Promise<User | undefined> {
    return this.updateById(userId, {
      lastLoginAt: new Date(),
      loginAttempts: 0,
      lockedUntil: null,
    });
  }

  /**
   * メール確認済みに更新
   */
  async markEmailAsVerified(userId: string): Promise<User | undefined> {
    return this.updateById(userId, {
      emailVerified: true,
    });
  }

  /**
   * ユーザーのアクティブ状態を変更
   */
  async setActiveStatus(userId: string, isActive: boolean): Promise<User | undefined> {
    return this.updateById(userId, { isActive });
  }

  /**
   * 役割でユーザー検索
   */
  async findByRole(role: 'admin' | 'editor' | 'member'): Promise<User[]> {
    return this.findMany(eq(this.table.role, role));
  }

  /**
   * 管理者ユーザー取得
   */
  async findAdmins(): Promise<User[]> {
    return this.findByRole('admin');
  }
}
