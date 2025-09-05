import { injectable, inject } from 'inversify';
import type { UserRepository } from '@/domain/auth/repositories';
import { User } from '@/domain/auth/entities';
import { UserNotFoundError } from '@/domain/auth/exceptions';
import { TYPES } from '@/lib/types';

// Command DTO
export interface VerifyEmailCommand {
  userId: string;
  token: string;
}

// Result DTO
export interface SuccessResult<T> {
  success: true;
  data: T;
}

export interface ErrorResult {
  success: false;
  error: string;
}

export type VerifyEmailResult = SuccessResult<User> | ErrorResult;

/**
 * VerifyEmailUseCase
 * 이메일 인증 비즈니스 로직 처리
 */
@injectable()
export class VerifyEmailUseCase {
  constructor(
    @inject(TYPES.userRepository) private userRepository: UserRepository
  ) {}

  async execute(command: VerifyEmailCommand): Promise<VerifyEmailResult> {
    try {
      // 1. 사용자 조회
      const user = await this.userRepository.findById(command.userId);
      if (!user) {
        throw new UserNotFoundError(command.userId);
      }

      // 2. 이미 인증된 경우
      if (user.isEmailVerified()) {
        return {
          success: true,
          data: user
        } as SuccessResult<User>;
      }

      // 3. 토큰 검증 (실제 구현에서는 토큰 검증 로직 추가)
      // 현재는 기본 검증만 수행
      if (!command.token || command.token.length < 10) {
        return {
          success: false,
          error: '유효하지 않은 인증 토큰입니다.'
        } as ErrorResult;
      }

      // 4. 이메일 인증 완료
      const verifiedUser = user.verifyEmail();
      await this.userRepository.save(verifiedUser);

      return {
        success: true,
        data: verifiedUser
      } as SuccessResult<User>;

    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return {
          success: false,
          error: error.message
        } as ErrorResult;
      }

      return {
        success: false,
        error: '이메일 인증 중 오류가 발생했습니다.'
      } as ErrorResult;
    }
  }
}
