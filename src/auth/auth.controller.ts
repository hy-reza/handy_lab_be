import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Res } from './../common/dto/res.dto';
import { User } from '@prisma/client';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  async register(
    @Body(new ValidationPipe({ transform: true })) newUser: CreateUserDto,
  ): Promise<Res<Omit<User, 'password'>>> {
    const { passwordConf, ...user } = newUser;
    //password match
    if (newUser.password !== passwordConf) {
      throw new HttpException(
        {
          meta: {
            isSuccess: false,
            message: 'Password does not match',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      meta: {
        isSuccess: true,
        message: 'User registered successfully!',
      },
      data: await this.authService.register(user),
    };
  }

  @Post('/login')
  async login(
    @Body(new ValidationPipe({ transform: true })) loginAuthDto: LoginAuthDto,
  ): Promise<Res<Omit<User, 'password'>>> {
    const { access_token, data } = await this.authService.login(loginAuthDto);
    return {
      meta: {
        isSuccess: true,
        message: 'User logged in successfully!',
      },
      data,
      access_token,
    };
  }
}
