import * as bcrypt from 'bcrypt';
import { Provider } from '@nestjs/common';

export const BCRYPT_PROVIDER = 'BCRYPT_PROVIDER';

export const BcryptProvider: Provider = {
  provide: BCRYPT_PROVIDER,
  useFactory: () => ({
    hash: async (password: string, salt: number): Promise<string> => {
      const s = await bcrypt.genSalt(salt);
      return bcrypt.hash(password, s);
    },
    compare: async (password: string, hash: string): Promise<boolean> => {
      return bcrypt.compare(password, hash);
    },
  }),
};
