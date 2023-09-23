import { Module } from '@nestjs/common';
import { TransactionProcessor } from './presentation/transaction.processor';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';

import { Customer, CustomerSchema } from './infractructure/customer.schema';
import { CustomerRepository } from './infractructure/customer.repository';

@Module({
  imports: [
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
  providers: [TransactionProcessor, CustomerRepository],
})
export class AppModule {}
