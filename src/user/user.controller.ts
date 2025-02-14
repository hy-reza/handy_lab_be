import {
  Body,
  Controller,
  Post,
  Param,
  Delete,
  Get,
  Query,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { Res } from 'src/common/dto/res.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/role-decorator/role-decorator.decorator';
import { AuthGuard } from 'src/common/guards/auth-guard/auth-guard.guard';
import { RoleGuard } from 'src/common/guards/role-guard/role-guard.guard';
// import { UpdateUserDto } from './dto/update-user.dto';
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async findAll(
    @Query('page')
    page: number,
    @Query('limit')
    limit: number,
    @Query('query')
    query: string,
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
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async findOne(
    @Param('id')
    id: string,
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
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async create(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    const { passwordConf, ...user } = createUserDto;
    const newUser = await this.userService.create(user);
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
      data: newUser,
    };
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async update(
    @Param('id')
    id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateUserDto: UpdateUserDto,
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
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async remove(
    @Param('id')
    id: string,
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
