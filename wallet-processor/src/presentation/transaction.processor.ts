import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';

import { Transaction } from './transaction.interface';
import { CustomerRepository } from '../infractructure/customer.repository';

interface JobData {
  transactions: Transaction[];
}

@Processor('transaction')
export class TransactionProcessor {
  constructor(
    private readonly customerRepository: CustomerRepository,
    @InjectQueue('transaction') private transactionQueue: Queue,
  ) {}

  @Process()
  public async executeTransactions(job: Job<JobData>) {
    const { transactions } = job.data;

    for (const { customerId, value } of transactions) {
      const customer = await this.customerRepository.get(customerId);
      if (!customer) {
        console.log(`Customer with ${customerId} doest not exist.`);
        continue;
      }

      const newBalance = customer.balance - value;
      if (newBalance < 0) {
        console.log(`Customer "${customerId}": Cannot subtract money from balance.\nCustomer balance: ${customer.balance}\nSubtraction value: ${value}`);
      } else {
        console.log(`Customer "${customerId}":\nOld balance: ${customer.balance}\nNew balance: ${newBalance}`);
        await this.customerRepository.updateBalance(customerId, newBalance);
      }
    }
  }
}
