import { UserService } from './../user/user.service';
import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'src/common/utils/bcrypt/bcrypt.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private UserService: UserService,
    private bcrypt: BcryptService,
  ) {}

  async register(
    newUser: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    // Check if the user already exists
    const userExists = await this.UserService.findByEmail(newUser.email);
    if (userExists) {
      throw new HttpException(
        {
          meta: {
            isSuccess: false,
            message: 'User already exists',
          },
        },
        409,
      );
    }
    // Hash the password
    const hashPassword = await this.bcrypt.hash(newUser.password, 10);
    console.log(hashPassword);
    // Create the user
    const user = await this.prisma.user.create({
      data: { ...newUser, password: hashPassword },
    });
    //generate refresh token
    const refresh_token = this.jwtService.sign(
      {
        id: user.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name || null,
        role: newUser.role,
      },
      {
        expiresIn: '30d',
      },
    );
    // Update the user with the refresh token
    const updatedNewUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { ...user, refresh_token },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedNewUser;
    return userWithoutPassword;
  }

  async login({ email, password }: LoginAuthDto): Promise<{
    access_token: string;
    data: Omit<User, 'password'>;
  }> {
    // Check if the user exists
    const userExists = await this.UserService.findByEmail(email);
    if (!userExists) {
      throw new HttpException(
        {
          meta: {
            isSuccess: false,
            message: 'email or password is incorrect',
          },
        },
        401,
      );
    }
    // Check if the password is correct
    const passwordMatch = await this.bcrypt.compare(
      password,
      userExists.password,
    );
    if (!passwordMatch) {
      throw new HttpException(
        {
          meta: {
            isSuccess: false,
            message: 'email or password is incorrect',
          },
        },
        401,
      );
    }
    // Generate the access token
    const access_token = this.jwtService.sign(
      {
        id: userExists.id,
        email: userExists.email,
        first_name: userExists.first_name,
        last_name: userExists.last_name || null,
        role: userExists.role,
      },
      {
        expiresIn: '1d',
      },
    );
    // Generate the refresh token
    const refresh_token = this.jwtService.sign(
      {
        id: userExists.id,
        email: userExists.email,
        first_name: userExists.first_name,
        last_name: userExists.last_name || null,
        role: userExists.role,
      },
      {
        expiresIn: '30d',
      },
    );
    // Update the user with the refresh token

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...updatedUser } = await this.prisma.user.update({
      where: { id: userExists.id },
      data: { refresh_token },
    });

    return {
      access_token,
      data: updatedUser,
    };
  }
}
