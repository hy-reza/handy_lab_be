import { AuthService } from './../auth/auth.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/common/utils/bcrypt/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private bcrypt: BcryptService,
  ) {}
  async findAll(
    page: number,
    limit: number,
    query: string,
  ): Promise<{
    users: Omit<User, 'password'>[];
    total: number;
  }> {
    const offset = page ? (page - 1) * limit : null;
    const total = await this.prisma.user.count({
      where: query
        ? {
            OR: [
              { first_name: { contains: query, mode: 'insensitive' } },
              { last_name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
    });
    return {
      total,
      users: await this.prisma.user.findMany({
        omit: { password: true },
        include: { Post: true, Project: true },
        skip: offset || 0,
        take: limit || total,
        where: query
          ? {
              OR: [
                { first_name: { contains: query, mode: 'insensitive' } },
                { last_name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
              ],
            }
          : undefined,
      }),
    };
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> | null {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    return user ? user : null;
  }

  async create(
    newUser: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    return await this.authService.register(newUser);
  }
  async update(
    id: string,
    updatedUser: Prisma.UserUpdateInput,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return;
    }
    if (updatedUser.password && typeof updatedUser.password === 'string') {
      updatedUser.password = await this.bcrypt.hash(updatedUser.password, 10);
    }

    return await this.prisma.user.update({
      where: { id },
      data: updatedUser,
    });
  }
  async remove(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return;
    }
    // Jika ada, lakukan penghapusan
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
}
