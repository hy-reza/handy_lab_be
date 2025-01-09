import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class User {
  @IsUUID(4, {
    message: 'Invalid user id',
  })
  @IsNotEmpty({
    message: 'User id is required',
  })
  id: string;

  @IsString({
    message: 'Email should be a string',
  })
  @IsNotEmpty({
    message: 'Email is required',
  })
  email: string;

  @IsString({
    message: 'Password should be a string',
  })
  @IsNotEmpty({
    message: 'Password is required',
  })
  @MinLength(6, {
    message: 'Password should be at least 6 characters long',
  })
  password: string;

  @IsString({
    message: 'First name should be a string',
  })
  @IsNotEmpty({
    message: 'First name is required',
  })
  first_name: string;

  @IsString({
    message: 'Last name should be a string',
  })
  last_name: string;

  @IsString({
    message: 'Role should be a string',
  })
  role: string;
}
