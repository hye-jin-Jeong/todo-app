import { User } from '../entities';
import { Email } from '../value-objects';
import { UserId } from '../types';

/**
 * UserRepository 인터페이스 - 기본 기능만
 */
export interface UserRepository {
  /**
   * ID로 사용자 조회
   */
  findById(id: UserId): Promise<User | null>;

  /**
   * 이메일로 사용자 조회
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * 사용자 저장
   */
  save(user: User): Promise<void>;

  /**
   * 이메일 존재 여부 확인
   */
  existsByEmail(email: Email): Promise<boolean>;
}
