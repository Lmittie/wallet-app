import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerController } from './presentation/controllers/customer.controller';
import { TransactionController } from './presentation/controllers/transaction.controller';
import { CustomerUseCases } from './domain/use-cases/customer.use-cases';
import { HeaderApiKeyStrategy } from './presentation/middlewares/header-api-key.strategy';
import { AuthMiddleware } from './presentation/middlewares/auth.middleware';
import { Customer, CustomerSchema } from './infrastructure/schemas/customer.schema';
import { CustomerRepository } from './infrastructure/repositories/customer.repository';
import { TransactionUseCases } from './domain/use-cases/transaction.use-cases';
import { BullModule } from '@nestjs/bull';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_NAME,
      auth: {
        username: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
      },
    }),
    MongooseModule.forFeature([{
      name: Customer.name,
      schema: CustomerSchema,
    }]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'transaction',
    }),
  ],
  controllers: [CustomerController, TransactionController],
  providers: [
    CustomerUseCases,
    CustomerRepository,
    TransactionUseCases,
    TransactionRepository,
    HeaderApiKeyStrategy,
    AuthMiddleware,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .forRoutes({ path: 'customer/(*)', method: RequestMethod.GET });
  }
}
