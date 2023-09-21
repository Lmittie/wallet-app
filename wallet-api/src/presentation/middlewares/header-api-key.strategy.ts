import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

const API_KEY = '123'; // todo remove key to env file

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  constructor() {
    super(
      { header: 'X-API-KEY', prefix: '' },
      true,
      async (apiKey, done) => {
        if (API_KEY === apiKey) {
          done(null, true);
        }

        done(new UnauthorizedException(), null);
      },
    );
  }
}
