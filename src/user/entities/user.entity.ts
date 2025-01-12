import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class User {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  role: string;

  @IsString()
  refresh_token?: string;

  Posts?: any[];
  Projects?: any[];
}
