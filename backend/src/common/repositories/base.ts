import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../db/drizzle.service';
import { eq, SQL } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

/**
 * Base Repository
 *
 * すべてのRepositoryが継承する抽象クラス。
 * 共通のCRUD操作を提供し、データアクセス層の統一インターフェースを定義します。
 *
 * @template TTable - Drizzle ORM のテーブル型
 * @template TSelect - SELECT時の型（TTable.$inferSelect）
 * @template TInsert - INSERT時の型（TTable.$inferInsert）
 */
@Injectable()
export abstract class BaseRepository<
  TTable extends PgTable,
  TSelect = TTable['$inferSelect'],
  TInsert = TTable['$inferInsert'],
> {
  protected readonly db: DrizzleService['db'];
  protected readonly table: TTable;

  constructor(drizzleService: DrizzleService, table: TTable) {
    this.db = drizzleService.db;
    this.table = table;
  }

  /**
   * 全レコード取得
   */
  async findAll(): Promise<TSelect[]> {
    // Drizzle ORMの型制約により`as any`が必要: PgTableは汎用的な`.from()`に直接渡せない
    return (await this.db.select().from(this.table as any)) as TSelect[];
  }

  /**
   * 条件に一致する複数レコード取得
   */
  async findMany(where: SQL): Promise<TSelect[]> {
    // Drizzle ORMの型制約により`as any`が必要
    return (await this.db
      .select()
      .from(this.table as any)
      .where(where)) as TSelect[];
  }

  /**
   * 条件に一致する単一レコード取得
   */
  async findOne(where: SQL): Promise<TSelect | undefined> {
    // Drizzle ORMの型制約により`as any`が必要
    const result = await this.db
      .select()
      .from(this.table as any)
      .where(where)
      .limit(1);
    return result[0] as TSelect | undefined;
  }

  /**
   * IDで単一レコード取得
   * @param id - レコードID
   * @param idColumn - IDカラム名（デフォルト: 'id'）
   */
  async findById(
    id: string,
    // Drizzle ORMの型制約: デフォルト値に'id'を指定するため`as any`が必要
    idColumn: keyof TTable['_']['columns'] = 'id' as any,
  ): Promise<TSelect | undefined> {
    const column = this.table[idColumn as string];
    return this.findOne(eq(column, id));
  }

  /**
   * 新規レコード作成
   */
  async create(data: TInsert): Promise<TSelect> {
    // Drizzle ORMの型制約: ジェネリック型TInsertを.values()に渡すため`as any`が必要
    const result = await this.db
      .insert(this.table)
      .values(data as any)
      .returning();
    return result[0] as TSelect;
  }

  /**
   * 複数レコード一括作成
   */
  async createMany(data: TInsert[]): Promise<TSelect[]> {
    // Drizzle ORMの型制約: ジェネリック型TInsert[]を.values()に渡すため`as any[]`が必要
    const result = await this.db
      .insert(this.table)
      .values(data as any[])
      .returning();
    return result as TSelect[];
  }

  /**
   * レコード更新
   */
  async update(where: SQL, data: Partial<TInsert>): Promise<TSelect[]> {
    // Drizzle ORMの型制約: ジェネリック型Partial<TInsert>を.set()に渡すため`as any`が必要
    const result = await this.db
      .update(this.table)
      .set(data as any)
      .where(where)
      .returning();
    return result as TSelect[];
  }

  /**
   * IDでレコード更新
   */
  async updateById(
    id: string,
    data: Partial<TInsert>,
    // Drizzle ORMの型制約: デフォルト値に'id'を指定するため`as any`が必要
    idColumn: keyof TTable['_']['columns'] = 'id' as any,
  ): Promise<TSelect | undefined> {
    const column = this.table[idColumn as string];
    const result = await this.update(eq(column, id), data);
    return result[0];
  }

  /**
   * レコード削除
   */
  async delete(where: SQL): Promise<TSelect[]> {
    const result = await this.db.delete(this.table).where(where).returning();
    return result as TSelect[];
  }

  /**
   * IDでレコード削除
   */
  async deleteById(
    id: string,
    // Drizzle ORMの型制約: デフォルト値に'id'を指定するため`as any`が必要
    idColumn: keyof TTable['_']['columns'] = 'id' as any,
  ): Promise<TSelect | undefined> {
    const column = this.table[idColumn as string];
    const result = await this.delete(eq(column, id));
    return result[0];
  }

  /**
   * レコード存在チェック
   */
  async exists(where: SQL): Promise<boolean> {
    const result = await this.findOne(where);
    return result !== undefined;
  }

  /**
   * レコード数カウント
   */
  async count(where?: SQL): Promise<number> {
    // Drizzle ORMの型制約により`as any`が必要
    const query = where
      ? this.db
          .select()
          .from(this.table as any)
          .where(where)
      : this.db.select().from(this.table as any);
    const result = await query;
    return result.length;
  }
}
