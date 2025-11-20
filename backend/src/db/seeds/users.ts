import { fakerJA as faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import * as schema from '../schema';
import { DatabaseInstance } from './types';

/**
 * ユーザーシーダー
 * 開発/テスト用のダミーユーザーデータを作成
 */
export async function seedUsers(db: DatabaseInstance, bcryptRounds: number) {
  console.log('  📝 Seeding users...');

  const users = [
    // 管理者ユーザー
    {
      email: 'admin@lumina-cms.local',
      password: await bcrypt.hash('Admin@123', bcryptRounds),
      name: 'システム管理者',
      role: 'admin' as const,
      isActive: true,
      emailVerified: new Date(),
      lastLoginAt: new Date(),
      image: faker.image.avatar(),
    },
    {
      email: 'admin2@lumina-cms.local',
      password: await bcrypt.hash('Admin@456', bcryptRounds),
      name: '副管理者',
      role: 'admin' as const,
      isActive: true,
      emailVerified: new Date(),
      lastLoginAt: faker.date.recent({ days: 7 }),
      image: faker.image.avatar(),
    },

    // 一般メンバー（アクティブ） - Fakerでリアルなデータを生成
    {
      email: faker.internet.email(),
      password: await bcrypt.hash('Member@123', bcryptRounds),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: faker.date.past({ years: 1 }),
      lastLoginAt: faker.date.recent({ days: 1 }),
      image: faker.image.avatar(),
    },
    {
      email: faker.internet.email(),
      password: await bcrypt.hash('Member@456', bcryptRounds),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: faker.date.past({ years: 1 }),
      lastLoginAt: faker.date.recent({ days: 7 }),
      image: faker.image.avatar(),
    },
    {
      email: faker.internet.email(),
      password: await bcrypt.hash('Member@789', bcryptRounds),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: faker.date.past({ years: 1 }),
      lastLoginAt: faker.date.recent({ days: 30 }),
      image: faker.image.avatar(),
    },

    // メール未検証ユーザー
    {
      email: 'unverified@example.com',
      password: await bcrypt.hash('Unverified@123', bcryptRounds),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: null,
    },

    // 非アクティブユーザー
    {
      email: 'inactive@example.com',
      password: await bcrypt.hash('Inactive@123', bcryptRounds),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: false,
      emailVerified: faker.date.past({ years: 1 }),
      image: faker.image.avatar(),
    },

    // ログイン試行失敗が多いユーザー
    {
      email: 'failed-attempts@example.com',
      password: await bcrypt.hash('Failed@123', bcryptRounds),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: faker.date.past({ years: 1 }),
      loginAttempts: 3,
      image: faker.image.avatar(),
    },

    // ロックされたユーザー（30分後に解除）
    {
      email: 'locked@example.com',
      password: await bcrypt.hash('Locked@123', bcryptRounds),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: true,
      emailVerified: faker.date.past({ years: 1 }),
      loginAttempts: 5,
      lockedUntil: faker.date.soon({ days: 1 }),
      image: faker.image.avatar(),
    },
  ];

  // さらに10人のランダムなテストユーザーを追加
  for (let i = 0; i < 10; i++) {
    users.push({
      email: faker.internet.email(),
      password: await bcrypt.hash('Test@123', bcryptRounds),
      name: faker.person.fullName(),
      role: 'member' as const,
      isActive: faker.datatype.boolean({ probability: 0.9 }), // 90%がアクティブ
      emailVerified: faker.datatype.boolean({ probability: 0.8 })
        ? faker.date.past({ years: 1 })
        : null, // 80%が検証済み
      lastLoginAt: faker.datatype.boolean({ probability: 0.7 })
        ? faker.date.recent({ days: 30 })
        : null, // 70%が最近ログイン
      image: faker.image.avatar(),
    });
  }

  // 一括挿入（重複は無視）
  await db.insert(schema.users).values(users).onConflictDoNothing();

  console.log(`  ✅ Created ${users.length} users`);
}
