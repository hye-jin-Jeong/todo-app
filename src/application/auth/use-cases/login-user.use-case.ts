import { injectable, inject } from 'inversify';
import type { UserRepository } from '@/domain/auth/repositories';
import { User } from '@/domain/auth/entities';
import { Email } from '@/domain/auth/value-objects';
import type { PasswordHasher } from '@/infrastructure/auth/services/password-hasher';
import { 
  UserNotFoundError, 
  InvalidCredentialsError,
  InvalidEmailError 
} from '@/domain/auth/exceptions';
import { TYPES } from '@/lib/types';

// Command DTO
export interface LoginUserCommand {
  email: string;
  password: string;
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

export type LoginUserResult = SuccessResult<User> | ErrorResult;

/**
 * LoginUserUseCase
 * 사용자 로그인 비즈니스 로직 처리
 */
@injectable()
export class LoginUserUseCase {
  constructor(
    @inject(TYPES.userRepository) private userRepository: UserRepository,
    @inject(TYPES.passwordHasher) private passwordHasher: PasswordHasher
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginUserResult> {
    try {
      // 1. 입력 검증
      const email = new Email(command.email);
      
      // 2. 사용자 조회
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new UserNotFoundError(command.email);
      }

      // 3. 이메일 인증 상태 확인 (개발용으로 주석 처리)
      // if (!user.isEmailVerified()) {
      //   return {
      //     success: false,
      //     error: '이메일 인증이 필요합니다.'
      //   } as ErrorResult;
      // }

      // 4. 비밀번호 검증
      const isValidPassword = await this.passwordHasher.compare(
        command.password, 
        user.hashedPassword
      );
      
      if (!isValidPassword) {
        throw new InvalidCredentialsError();
      }

      return {
        success: true,
        data: user
      } as SuccessResult<User>;

    } catch (error) {
      if (error instanceof UserNotFoundError || 
          error instanceof InvalidCredentialsError || 
          error instanceof InvalidEmailError) {
        return {
          success: false,
          error: error.message
        } as ErrorResult;
      }

      return {
        success: false,
        error: '로그인 중 오류가 발생했습니다.'
      } as ErrorResult;
    }
  }
}
