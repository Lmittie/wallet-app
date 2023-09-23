import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  constructor() {
    super(
      { header: 'X-API-KEY', prefix: '' },
      true,
      async (apiKey, done) => {
        if (apiKey === process.env.API_KEY) {
          done(null, true);
        }

        done(new UnauthorizedException(), null);
      },
    );
  }
}
