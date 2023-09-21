import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { CustomerController } from './presentation/controllers/customer.controller';
import { TransactionController } from './presentation/controllers/transaction.controller';
import { CustomerUseCases } from './use-cases/customer.use-cases';
import { HeaderApiKeyStrategy } from './presentation/middlewares/header-api-key.strategy';
import { AuthMiddleware } from './presentation/middlewares/auth.middleware';

@Module({
  imports: [PassportModule],
  controllers: [CustomerController, TransactionController],
  providers: [CustomerUseCases, HeaderApiKeyStrategy, AuthMiddleware],
})
export class AppModule {}
