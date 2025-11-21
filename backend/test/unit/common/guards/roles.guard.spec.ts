import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '../../../../src/common/guards/roles.guard';
import { ROLES_KEY } from '../../../../src/common/decorators/roles.decorator';

// Type for test user
type TestUser = {
  id: string;
  email: string;
  role: string;
};

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    // Suppress logger output during tests
    const logger = module.get(RolesGuard)['logger'];
    logger.log = jest.fn();
    logger.debug = jest.fn();
    logger.warn = jest.fn();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (
    user?: TestUser | Partial<TestUser> | null,
    requiredRoles?: string[],
  ): ExecutionContext => {
    const mockRequest = {
      user,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as unknown as ExecutionContext;

    // Mock reflector to return required roles (always mock, even when undefined)
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

    return context;
  };

  describe('ロール一致', () => {
    it('必要なロールを持つユーザーでアクセス許可されること', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'admin@example.com',
        role: 'admin',
      };

      const context = createMockExecutionContext(user, ['admin']);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('canActivate()がtrueを返すこと (@Roles("admin"), user.role === "admin")', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'admin@example.com',
        role: 'admin',
      };

      const context = createMockExecutionContext(user, ['admin']);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('editorロールでeditorが必要なエンドポイントにアクセスできること', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'editor@example.com',
        role: 'editor',
      };

      const context = createMockExecutionContext(user, ['editor']);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('memberロールでmemberが必要なエンドポイントにアクセスできること', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'member@example.com',
        role: 'member',
      };

      const context = createMockExecutionContext(user, ['member']);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('ロール不一致', () => {
    it('必要なロールを持たないユーザーでForbiddenExceptionがスローされること', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'member@example.com',
        role: 'member',
      };

      const context = createMockExecutionContext(user, ['admin']);

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('ForbiddenException("このリソースにアクセスする権限がありません")がスローされること', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'member@example.com',
        role: 'member',
      };

      const context = createMockExecutionContext(user, ['admin']);

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(
        'このリソースにアクセスする権限がありません',
      );
    });

    it('memberがadminエンドポイントにアクセスできないこと', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'member@example.com',
        role: 'member',
      };

      const context = createMockExecutionContext(user, ['admin']);

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('editorがadminエンドポイントにアクセスできないこと', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'editor@example.com',
        role: 'editor',
      };

      const context = createMockExecutionContext(user, ['admin']);

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });

  describe('ロール指定なし', () => {
    it('@Roles()デコレータがない場合、すべてのユーザーがアクセス可能', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'member@example.com',
        role: 'member',
      };

      const context = createMockExecutionContext(user, undefined);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('canActivate()がtrueを返すこと (ロール指定なし)', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'admin@example.com',
        role: 'admin',
      };

      const context = createMockExecutionContext(user, []);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('requiredRolesが空配列の場合、すべてのユーザーがアクセス可能', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'member@example.com',
        role: 'member',
      };

      const context = createMockExecutionContext(user, []);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('複数ロール', () => {
    it('複数ロールのいずれかを持つユーザーでアクセス許可されること', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'editor@example.com',
        role: 'editor',
      };

      const context = createMockExecutionContext(user, ['admin', 'editor']);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('canActivate()がtrueを返すこと (@Roles("admin", "editor"), user.role === "editor")', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'editor@example.com',
        role: 'editor',
      };

      const context = createMockExecutionContext(user, ['admin', 'editor']);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('adminユーザーが["admin", "editor"]が必要なエンドポイントにアクセスできること', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'admin@example.com',
        role: 'admin',
      };

      const context = createMockExecutionContext(user, ['admin', 'editor']);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('memberユーザーが["admin", "editor"]が必要なエンドポイントにアクセスできないこと', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'member@example.com',
        role: 'member',
      };

      const context = createMockExecutionContext(user, ['admin', 'editor']);

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('3つのロールのいずれかを持つユーザーがアクセスできること', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'member@example.com',
        role: 'member',
      };

      const context = createMockExecutionContext(user, ['admin', 'editor', 'member']);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('ユーザー情報なし', () => {
    it('request.userが存在しない場合ForbiddenExceptionがスローされること', () => {
      // Arrange
      const context = createMockExecutionContext(undefined, ['admin']);

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('ForbiddenException("ユーザー情報が見つかりません")がスローされること', () => {
      // Arrange
      const context = createMockExecutionContext(undefined, ['admin']);

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow('ユーザー情報が見つかりません');
    });

    it('request.userがnullの場合ForbiddenExceptionがスローされること', () => {
      // Arrange
      const context = createMockExecutionContext(null, ['admin']);

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });

  describe('エッジケース', () => {
    it('ユーザーにroleプロパティがない場合ForbiddenExceptionがスローされること', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        // role property is missing
      };

      const context = createMockExecutionContext(user, ['admin']);

      // Act & Assert
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('reflectorが正しくメタデータを取得すること', () => {
      // Arrange
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'admin@example.com',
        role: 'admin',
      };

      const context = createMockExecutionContext(user, ['admin']);
      const getAllAndOverrideSpy = jest.spyOn(reflector, 'getAllAndOverride');

      // Act
      guard.canActivate(context);

      // Assert
      expect(getAllAndOverrideSpy).toHaveBeenCalledWith(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });
  });
});
