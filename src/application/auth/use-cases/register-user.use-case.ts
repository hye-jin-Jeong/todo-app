import { injectable, inject } from 'inversify';
import type { UserRepository } from '@/domain/auth/repositories';
import { User } from '@/domain/auth/entities';
import { Email } from '@/domain/auth/value-objects';
import type { PasswordHasher } from '@/infrastructure/auth/services';
import { 
  UserAlreadyExistsError, 
  InvalidEmailError 
} from '@/domain/auth/exceptions';
import { TYPES } from '@/lib/types';

// Command DTO
export interface RegisterUserCommand {
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

export type RegisterUserResult = SuccessResult<User> | ErrorResult;

/**
 * RegisterUserUseCase
 * 사용자 등록 비즈니스 로직 처리
 */
@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject(TYPES.userRepository) private userRepository: UserRepository,
    @inject(TYPES.passwordHasher) private passwordHasher: PasswordHasher
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    try {
      // 1. 입력 검증
      const email = new Email(command.email);
      
      // 2. 이메일 중복 확인
      const exists = await this.userRepository.existsByEmail(email);
      if (exists) {
        throw new UserAlreadyExistsError(command.email);
      }

      // 3. 비밀번호 해싱
      const hashedPassword = await this.passwordHasher.hash(command.password);

      // 4. 사용자 생성
      const user = User.create(email, hashedPassword);
      
      // 5. 사용자 저장
      await this.userRepository.save(user);

      return {
        success: true,
        data: user
      };

    } catch (error) {
      if (error instanceof UserAlreadyExistsError || error instanceof InvalidEmailError) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: false,
        error: '사용자 등록 중 오류가 발생했습니다.'
      };
    }
  }
}
