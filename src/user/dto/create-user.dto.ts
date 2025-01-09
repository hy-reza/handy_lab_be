import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password is required',
  })
  @MinLength(6, {
    message: 'Password should be at least 6 characters long',
  })
  password: string;

  @IsString()
  @IsNotEmpty({
    message: 'First name is required',
  })
  first_name: string;

  @IsString()
  last_name: string;
}
