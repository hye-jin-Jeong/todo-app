import { UserRepository } from '@/domain/auth/repositories';
import { User } from '@/domain/auth/entities';
import { Email } from '@/domain/auth/value-objects';
import { UserId } from '@/domain/auth/types';
import { prisma } from '@/lib/prisma';

/**
 * PrismaUserRepository 구현체
 * UserRepository 인터페이스의 Prisma 구현
 */
export class PrismaUserRepository implements UserRepository {
  /**
   * ID로 사용자 조회
   */
  async findById(id: UserId): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return null;
    }

    return User.fromAuthUser({
      ...user,
      hashedPassword: user.hashedPassword || ''
    });
  }

  /**
   * 이메일로 사용자 조회
   */
  async findByEmail(email: Email): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.getValue() }
    });

    if (!user) {
      return null;
    }

    return User.fromAuthUser({
      ...user,
      hashedPassword: user.hashedPassword || ''
    });
  }

  /**
   * 사용자 저장
   */
  async save(user: User): Promise<void> {
    const authUser = user.toAuthUser();
    
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: authUser.email,
        hashedPassword: authUser.hashedPassword,
        emailVerified: authUser.emailVerified,
        updatedAt: authUser.updatedAt
      },
      create: {
        id: authUser.id,
        email: authUser.email,
        hashedPassword: authUser.hashedPassword,
        emailVerified: authUser.emailVerified,
        createdAt: authUser.createdAt,
        updatedAt: authUser.updatedAt
      }
    });
  }

  /**
   * 이메일 존재 여부 확인
   */
  async existsByEmail(email: Email): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email: email.getValue() },
      select: { id: true }
    });

    return user !== null;
  }
}