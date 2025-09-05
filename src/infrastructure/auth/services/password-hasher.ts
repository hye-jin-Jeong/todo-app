import { injectable } from 'inversify';
import bcrypt from 'bcryptjs';

/**
 * PasswordHasher
 * 비밀번호 해싱 및 검증을 담당하는 인프라 서비스
 */
@injectable()
export class PasswordHasher {
  private readonly saltRounds = 12;

  /**
   * 비밀번호를 해시화합니다.
   * @param password 원본 비밀번호
   * @returns 해시된 비밀번호
   */
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * 비밀번호와 해시를 비교합니다.
   * @param password 원본 비밀번호
   * @param hash 해시된 비밀번호
   * @returns 일치 여부
   */
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
