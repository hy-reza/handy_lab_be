import { Inject, Injectable } from '@nestjs/common';
import { BCRYPT_PROVIDER } from './bcrypt';

@Injectable()
export class BcryptService {
  constructor(
    @Inject(BCRYPT_PROVIDER)
    private bcrypt: {
      hash: (password: string, salt: number) => Promise<string>;
      compare: (password: string, hash: string) => Promise<boolean>;
    },
  ) {}

  hash(password: string, salt: number): Promise<string> {
    return this.bcrypt.hash(password, salt);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return this.bcrypt.compare(password, hash);
  }
}
