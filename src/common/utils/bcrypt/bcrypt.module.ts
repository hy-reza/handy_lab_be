import { Module } from '@nestjs/common';
import { BcryptProvider } from './bcrypt';
import { BcryptService } from './bcrypt.service';

@Module({
  providers: [BcryptProvider, BcryptService],
  exports: [BcryptService],
})
export class BcryptModule {}
