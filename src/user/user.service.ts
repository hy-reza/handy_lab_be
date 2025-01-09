import { Res } from './../common/dto/res/res';
import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  register(Body): Res {
    return {
      meta: {
        isSuccess: true,
        code: 200,
        message: 'User registered successfully',
      },
    };
  }
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }
  // findAll() {
  //   return `This action returns all user`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
