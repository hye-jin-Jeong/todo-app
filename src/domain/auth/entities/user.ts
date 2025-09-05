import { UserId } from '../types';
import { Email } from '../value-objects';

/**
 * User 엔티티 - 기본 기능만
 */
export class User {
  constructor(
    private readonly _id: UserId,
    private readonly _email: Email,
    private readonly _hashedPassword: string,
    private readonly _emailVerified: Date | null,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {}

  // Getters
  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get hashedPassword(): string {
    return this._hashedPassword;
  }

  get emailVerified(): Date | null {
    return this._emailVerified;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * 이메일 인증 완료
   */
  verifyEmail(): User {
    if (this._emailVerified) {
      return this; // 이미 인증됨
    }
    
    return new User(
      this._id,
      this._email,
      this._hashedPassword,
      new Date(),
      this._createdAt,
      new Date()
    );
  }

  /**
   * 이메일 인증 상태 확인
   */
  isEmailVerified(): boolean {
    return this._emailVerified !== null;
  }

  /**
   * Auth.js User 모델로 변환
   */
  toAuthUser() {
    return {
      id: this._id,
      email: this._email.getValue(),
      hashedPassword: this._hashedPassword,
      emailVerified: this._emailVerified,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  /**
   * 정적 팩토리 메서드: Auth.js User로부터 생성
   */
  static fromAuthUser(authUser: {
    id: UserId;
    email: string;
    hashedPassword: string;
    emailVerified?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      authUser.id,
      new Email(authUser.email),
      authUser.hashedPassword,
      authUser.emailVerified || null,
      authUser.createdAt,
      authUser.updatedAt
    );
  }

  /**
   * 정적 팩토리 메서드: 새 사용자 생성
   */
  static create(email: Email, hashedPassword: string): User {
    const now = new Date();
    return new User(
      crypto.randomUUID(), // 임시 ID, 실제로는 Repository에서 생성
      email,
      hashedPassword,
      null, // 이메일 미인증 상태
      now,
      now
    );
  }
}
