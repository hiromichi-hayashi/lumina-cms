import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../../src/modules/auth/auth.service';
import { SessionRepository } from '../../../../src/modules/auth/repositories/session.repository';
import { VerificationTokenRepository } from '../../../../src/modules/auth/repositories/verification-token.repository';

/**
 * AuthService ユニットテスト (Better Auth統合版 + Repository Pattern)
 *
 * Better Auth統合後、AuthServiceはヘルパーサービスとなり、
 * 認証ロジックはすべてBetter Authが担当します。
 * Repository Patternにより、データアクセスは各Repositoryが担当します。
 *
 * このテストでは以下の機能をテストします:
 * - 期限切れセッションのクリーンアップ
 * - 期限切れ検証トークンのクリーンアップ
 * - アクティブセッション数の取得
 */
describe('AuthService (Better Auth Integration)', () => {
  let service: AuthService;
  let sessionRepository: SessionRepository;
  let verificationTokenRepository: VerificationTokenRepository;

  // Mock repositories
  const mockSessionRepository = {
    deleteExpired: jest.fn(),
    countActive: jest.fn(),
  };

  const mockVerificationTokenRepository = {
    deleteExpired: jest.fn(),
  };

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SessionRepository,
          useValue: mockSessionRepository,
        },
        {
          provide: VerificationTokenRepository,
          useValue: mockVerificationTokenRepository,
        },
      ],
    }).compile();

    // Suppress logger output during tests
    const logger = module.get(AuthService)['logger'];
    logger.log = jest.fn();
    logger.debug = jest.fn();
    logger.warn = jest.fn();
    logger.error = jest.fn();

    service = module.get<AuthService>(AuthService);
    sessionRepository = module.get<SessionRepository>(SessionRepository);
    verificationTokenRepository = module.get<VerificationTokenRepository>(VerificationTokenRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cleanupExpiredSessions', () => {
    it('期限切れセッションを削除できること', async () => {
      // Arrange
      mockSessionRepository.deleteExpired.mockResolvedValueOnce(2);

      // Act
      const count = await service.cleanupExpiredSessions();

      // Assert
      expect(count).toBe(2);
      expect(mockSessionRepository.deleteExpired).toHaveBeenCalled();
    });

    it('期限切れセッションがない場合は0を返すこと', async () => {
      // Arrange
      mockSessionRepository.deleteExpired.mockResolvedValueOnce(0);

      // Act
      const count = await service.cleanupExpiredSessions();

      // Assert
      expect(count).toBe(0);
    });

    it('エラー時は例外をスローすること', async () => {
      // Arrange
      mockSessionRepository.deleteExpired.mockRejectedValueOnce(new Error('Database error'));

      // Act & Assert
      await expect(service.cleanupExpiredSessions()).rejects.toThrow('Database error');
    });
  });

  describe('cleanupExpiredVerificationTokens', () => {
    it('期限切れ検証トークンを削除できること', async () => {
      // Arrange
      mockVerificationTokenRepository.deleteExpired.mockResolvedValueOnce(2);

      // Act
      const count = await service.cleanupExpiredVerificationTokens();

      // Assert
      expect(count).toBe(2);
      expect(mockVerificationTokenRepository.deleteExpired).toHaveBeenCalled();
    });

    it('期限切れトークンがない場合は0を返すこと', async () => {
      // Arrange
      mockVerificationTokenRepository.deleteExpired.mockResolvedValueOnce(0);

      // Act
      const count = await service.cleanupExpiredVerificationTokens();

      // Assert
      expect(count).toBe(0);
    });

    it('エラー時は例外をスローすること', async () => {
      // Arrange
      mockVerificationTokenRepository.deleteExpired.mockRejectedValueOnce(new Error('Database error'));

      // Act & Assert
      await expect(service.cleanupExpiredVerificationTokens()).rejects.toThrow('Database error');
    });
  });

  describe('getActiveSessionsCount', () => {
    it('アクティブセッション数を取得できること', async () => {
      // Arrange
      mockSessionRepository.countActive.mockResolvedValueOnce(2);

      // Act
      const count = await service.getActiveSessionsCount();

      // Assert
      expect(count).toBe(2);
      expect(mockSessionRepository.countActive).toHaveBeenCalled();
    });

    it('アクティブセッションがない場合は0を返すこと', async () => {
      // Arrange
      mockSessionRepository.countActive.mockResolvedValueOnce(0);

      // Act
      const count = await service.getActiveSessionsCount();

      // Assert
      expect(count).toBe(0);
    });

    it('エラー時は0を返すこと', async () => {
      // Arrange
      mockSessionRepository.countActive.mockRejectedValueOnce(new Error('Database error'));

      // Act
      const count = await service.getActiveSessionsCount();

      // Assert
      expect(count).toBe(0);
    });
  });
});
