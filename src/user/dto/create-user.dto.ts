import {
  // Equals,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // @Equals('password')
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  passwordConf: string;

  @IsString()
  @IsNotEmpty({})
  first_name: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  role?: string;
}
