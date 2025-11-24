import { fakerJA as faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import * as schema from '../schema';
import { DatabaseInstance } from './types';

/**
 * ユーザーシーダー
 * 開発/テスト用のダミーユーザーデータを作成
 *
 * Better Auth仕様:
 * - パスワードは users テーブルではなく accounts テーブルに保存
 * - メール/パスワード認証の場合、provider='credential'
 * - accountId = userId （credential認証の場合）
 */
export async function seedUsers(db: DatabaseInstance, bcryptRounds: number) {
  console.log('  📝 Seeding users...');

  // パスワードを事前にハッシュ化
  const adminPassword = await bcrypt.hash('Admin@123', bcryptRounds);
  const admin2Password = await bcrypt.hash('Admin@456', bcryptRounds);
  const memberPassword = await bcrypt.hash('Member@123', bcryptRounds);
  const testPassword = await bcrypt.hash('Test@123', bcryptRounds);
  const unverifiedPassword = await bcrypt.hash('Unverified@123', bcryptRounds);
  const inactivePassword = await bcrypt.hash('Inactive@123', bcryptRounds);
  const failedPassword = await bcrypt.hash('Failed@123', bcryptRounds);
  const lockedPassword = await bcrypt.hash('Locked@123', bcryptRounds);

  // ユーザーデータ（passwordなし）
  // Better Auth CLI標準スキーマ: emailVerified は boolean型
  const usersData = [
    // 管理者ユーザー
    {
      email: 'admin@lumina-cms.local',
      name: 'システム管理者',
      role: 'admin' as const,
      isActive: true,
      emailVerified: true,
      lastLoginAt: new Date(),
      image: faker.image.avatar(),
      _password: adminPassword,
    },
    {
      email: 'admin2@lumina-cms.local',
      name: '副管理者',
      role: 'admin' as const,
      isActive: true,
      emailVerified: true,
      lastLoginAt: faker.date.recent({ days: 7 }),
      image: faker.image.avatar(),
      _password: admin2Password,
    },

    // 一般メンバー（アクティブ）
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: true,
      lastLoginAt: faker.date.recent({ days: 1 }),
      image: faker.image.avatar(),
      _password: memberPassword,
    },
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: true,
      lastLoginAt: faker.date.recent({ days: 7 }),
      image: faker.image.avatar(),
      _password: memberPassword,
    },
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: true,
      lastLoginAt: faker.date.recent({ days: 30 }),
      image: faker.image.avatar(),
      _password: memberPassword,
    },

    // メール未検証ユーザー
    {
      email: 'unverified@example.com',
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: false,
      _password: unverifiedPassword,
    },

    // 非アクティブユーザー
    {
      email: 'inactive@example.com',
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: false,
      emailVerified: true,
      image: faker.image.avatar(),
      _password: inactivePassword,
    },

    // ログイン試行失敗が多いユーザー
    {
      email: 'failed-attempts@example.com',
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: true,
      loginAttempts: 3,
      image: faker.image.avatar(),
      _password: failedPassword,
    },

    // ロックされたユーザー
    {
      email: 'locked@example.com',
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: true,
      loginAttempts: 5,
      lockedUntil: faker.date.soon({ days: 1 }),
      image: faker.image.avatar(),
      _password: lockedPassword,
    },
  ];

  // ランダムなテストユーザーを10人追加
  for (let i = 0; i < 10; i++) {
    usersData.push({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: faker.datatype.boolean({ probability: 0.9 }),
      emailVerified: faker.datatype.boolean({ probability: 0.8 }),
      lastLoginAt: faker.datatype.boolean({ probability: 0.7 })
        ? faker.date.recent({ days: 30 })
        : null,
      image: faker.image.avatar(),
      _password: testPassword,
    });
  }

  // usersテーブルに挿入（passwordフィールドを除外）
  const insertedUsers = await db
    .insert(schema.users)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .values(usersData.map(({ _password, ...user }) => user))
    .onConflictDoNothing()
    .returning();

  console.log(`  ✅ Created ${insertedUsers.length} users`);

  // accountsテーブルにcredential認証レコードを作成
  // Better Auth CLIスキーマ: accountId, providerId
  console.log('  📝 Creating credential accounts...');

  const accountsData = insertedUsers.map((user, index) => ({
    userId: user.id,
    accountId: user.id, // credential認証の場合、userIdと同じ
    providerId: 'credential',
    password: usersData[index]._password,
  }));

  await db.insert(schema.accounts).values(accountsData).onConflictDoNothing();

  console.log(`  ✅ Created ${accountsData.length} credential accounts`);
}
