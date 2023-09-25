import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';

import { Transaction } from './transaction.interface';
import { CustomerRepository } from '../infractructure/customer.repository';
import { CustomerUseCases } from '../domain/customer.use-cases';

interface JobData {
  transactions: Transaction[];
}

@Processor('transaction')
export class TransactionProcessor {
  constructor(
    private readonly customerUseCases: CustomerUseCases,
    @InjectQueue('transaction') private transactionQueue: Queue,
  ) {}

  @Process()
  public async executeTransactions(job: Job<JobData>) {
    const { transactions } = job.data;

    for (const { customerId, value } of transactions) {
      await this.customerUseCases.subtractFromBalance(customerId, value);
    }
  }
}
