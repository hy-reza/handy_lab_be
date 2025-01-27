import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BcryptModule } from 'src/common/utils/bcrypt/bcrypt.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [forwardRef(() => AuthModule), BcryptModule],
})
export class UserModule {}
