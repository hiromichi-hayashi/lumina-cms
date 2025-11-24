import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '../../../../src/common/guards/auth';

/**
 * AuthGuard ユニットテスト (Better Auth統合版)
 *
 * Better Auth統合後、AuthGuardはBetter AuthのセッションAPIを使用して
 * セッション検証を行います。
 *
 * このテストでは以下の機能をテストします:
 * - Better AuthセッションAPIを使用した認証
 * - 有効なセッションでのアクセス許可
 * - 無効なセッションでの認証拒否
 * - リクエストオブジェクトへのユーザー情報の追加
 */
describe('AuthGuard (Better Auth Integration)', () => {
  let guard: AuthGuard;
  let mockBetterAuth: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Better Authのモック
    mockBetterAuth = {
      api: {
        getSession: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: 'BETTER_AUTH',
          useValue: mockBetterAuth,
        },
      ],
    }).compile();

    // Suppress logger output during tests
    const logger = module.get(AuthGuard)['logger'];
    logger.log = jest.fn();
    logger.debug = jest.fn();
    logger.warn = jest.fn();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (headers: Record<string, string> = {}): ExecutionContext => {
    const mockRequest = {
      headers,
      user: undefined,
      session: undefined,
    };

    return {
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
  };

  describe('認証成功', () => {
    it('有効なセッションでアクセス許可されること', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'test@example.com',
          name: 'Test User',
          role: 'member',
        },
        session: {
          id: '660e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440000',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };

      mockBetterAuth.api.getSession.mockResolvedValueOnce(mockSession);

      const context = createMockExecutionContext({
        cookie: 'lumina.session_token=valid-token',
      });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(mockBetterAuth.api.getSession).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.any(Headers),
        }),
      );
    });

    it('canActivate()がtrueを返すこと', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'test@example.com',
          name: 'Test User',
          role: 'member',
        },
        session: {
          id: '660e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440000',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };

      mockBetterAuth.api.getSession.mockResolvedValueOnce(mockSession);

      const context = createMockExecutionContext({
        cookie: 'lumina.session_token=valid-token',
      });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('request.userにユーザー情報が設定されること', async () => {
      // Arrange
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: 'Test User',
        role: 'member',
      };

      const mockSession = {
        user: mockUser,
        session: {
          id: '660e8400-e29b-41d4-a716-446655440000',
          userId: mockUser.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };

      mockBetterAuth.api.getSession.mockResolvedValueOnce(mockSession);

      const context = createMockExecutionContext({
        cookie: 'lumina.session_token=valid-token',
      });

      const request = context.switchToHttp().getRequest();

      // Act
      await guard.canActivate(context);

      // Assert
      expect(request.user).toBeDefined();
      expect(request.user.id).toBe(mockUser.id);
      expect(request.user.email).toBe(mockUser.email);
      expect(request.user.role).toBe(mockUser.role);
    });

    it('request.sessionにセッション情報が設定されること', async () => {
      // Arrange
      const mockSessionData = {
        id: '660e8400-e29b-41d4-a716-446655440000',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      const mockSession = {
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'test@example.com',
          name: 'Test User',
          role: 'member',
        },
        session: mockSessionData,
      };

      mockBetterAuth.api.getSession.mockResolvedValueOnce(mockSession);

      const context = createMockExecutionContext({
        cookie: 'lumina.session_token=valid-token',
      });

      const request = context.switchToHttp().getRequest();

      // Act
      await guard.canActivate(context);

      // Assert
      expect(request.session).toBeDefined();
      expect(request.session).toEqual(mockSessionData);
    });
  });

  describe('認証失敗', () => {
    it('セッションがnullの場合にUnauthorizedExceptionがスローされること', async () => {
      // Arrange
      mockBetterAuth.api.getSession.mockResolvedValueOnce(null);

      const context = createMockExecutionContext({
        cookie: 'lumina.session_token=invalid-token',
      });

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(context)).rejects.toThrow('認証が必要です');
    });

    it('セッションにユーザー情報がない場合にUnauthorizedExceptionがスローされること', async () => {
      // Arrange
      const mockSession = {
        user: null,
        session: {
          id: '660e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440000',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };

      mockBetterAuth.api.getSession.mockResolvedValueOnce(mockSession);

      const context = createMockExecutionContext({
        cookie: 'lumina.session_token=valid-token',
      });

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(context)).rejects.toThrow('認証が必要です');
    });

    it('Better AuthのgetSessionでエラーが発生した場合にUnauthorizedExceptionがスローされること', async () => {
      // Arrange
      mockBetterAuth.api.getSession.mockRejectedValueOnce(new Error('Session API error'));

      const context = createMockExecutionContext({
        cookie: 'lumina.session_token=error-token',
      });

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(context)).rejects.toThrow('認証が必要です');
    });

    it('セッショントークンがない場合にUnauthorizedExceptionがスローされること', async () => {
      // Arrange
      mockBetterAuth.api.getSession.mockResolvedValueOnce(null);

      const context = createMockExecutionContext({});

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('異なるロールのユーザー', () => {
    it('admin roleのユーザーが認証できること', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        session: {
          id: '660e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440000',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };

      mockBetterAuth.api.getSession.mockResolvedValueOnce(mockSession);

      const context = createMockExecutionContext({
        cookie: 'lumina.session_token=admin-token',
      });

      const request = context.switchToHttp().getRequest();

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(request.user.role).toBe('admin');
    });

    it('editor roleのユーザーが認証できること', async () => {
      // Arrange
      const mockSession = {
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'editor@example.com',
          name: 'Editor User',
          role: 'editor',
        },
        session: {
          id: '660e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440000',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };

      mockBetterAuth.api.getSession.mockResolvedValueOnce(mockSession);

      const context = createMockExecutionContext({
        cookie: 'lumina.session_token=editor-token',
      });

      const request = context.switchToHttp().getRequest();

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(request.user.role).toBe('editor');
    });
  });
});
