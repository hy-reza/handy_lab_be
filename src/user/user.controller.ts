import {
  Body,
  Controller,
  Post,
  // Patch,
  Param,
  Delete,
  Get,
  Query,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { Res } from 'src/common/dto/res.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('page', new ValidationPipe({ transform: true })) page: number,
    @Query('limit', new ValidationPipe({ transform: true })) limit: number,
    @Query('query', new ValidationPipe({ transform: true })) query: string,
  ): Promise<Res<Omit<User, 'password'>[]>> {
    const { total: totalItems, users } = await this.userService.findAll(
      page,
      limit,
      query,
    );
    return {
      meta: {
        isSuccess: true,
        message: 'Users fetched successfully',
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        limit,
        offset: (page - 1) * limit,
        hasNext: page ? page < Math.ceil(totalItems / limit) : false,
        hasPrevious: page > 1,
      },
      data: users,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', new ValidationPipe({ transform: true })) id: string,
  ) {
    const user = await this.userService.findOne(id);
    console.log({ user });
    if (!user) {
      throw new HttpException(
        {
          meta: {
            isSuccess: false,
            message: 'User not found',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      meta: {
        isSuccess: true,
        message: 'User fetched successfully',
      },
      data: user,
    };
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserDto,
  ) {
    const { passwordConf, ...user } = createUserDto;
    //password match
    if (createUserDto.password !== passwordConf) {
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
        message: 'User created successfully!',
      },
      data: await this.userService.create(user),
    };
  }

  @Patch(':id')
  async update(
    @Param('id', new ValidationPipe({ transform: true })) id: string,
    @Body(new ValidationPipe({ transform: true })) updateUserDto: UpdateUserDto,
  ) {
    const { passwordConf, ...user } = updateUserDto;
    //password match
    if (updateUserDto.password !== passwordConf) {
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
    const data = await this.userService.update(id, user);
    if (!data) {
      throw new HttpException(
        {
          meta: {
            isSuccess: false,
            message: 'User not found!',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      meta: {
        isSuccess: true,
        message: 'User updated successfully!',
      },
      data,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', new ValidationPipe({ transform: true })) id: string,
  ) {
    const data = await this.userService.remove(id);

    if (!data) {
      throw new HttpException(
        {
          meta: {
            isSuccess: false,
            message: 'User not found!',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      meta: {
        isSuccess: true,
        message: 'User deleted successfully!',
      },
      data,
    };
  }
}
