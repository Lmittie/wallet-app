import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  public async use(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    req.isAuthorized = apiKey === process.env.API_KEY;
    next();
  }
}
