import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'ユーザーID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'メールアドレス',
    example: 'user@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'ユーザー名',
    example: '山田太郎',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'アバターURL',
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl?: string;

  @ApiProperty({
    description: 'ユーザーロール',
    example: 'member',
    enum: ['admin', 'member'],
  })
  role: string;

  @ApiPropertyOptional({
    description: 'メール認証日時',
    example: '2025-01-01T00:00:00.000Z',
  })
  emailVerified?: Date;

  @ApiProperty({
    description: '作成日時',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

export class SessionDto {
  @ApiProperty({
    description: 'セッションID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'セッショントークン',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  sessionToken: string;

  @ApiProperty({
    description: 'ユーザーID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: '有効期限',
    example: '2025-01-08T00:00:00.000Z',
  })
  expires: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'ユーザー情報',
    type: UserDto,
  })
  user: UserDto;

  @ApiProperty({
    description: 'セッション情報',
    type: SessionDto,
  })
  session: SessionDto;

  @ApiProperty({
    description: '認証トークン',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}
