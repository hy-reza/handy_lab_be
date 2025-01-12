import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { BcryptModule } from 'src/common/utils/bcrypt/bcrypt.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UserModule, BcryptModule],
})
export class AuthModule {}
