import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { TransactionDto } from '../../presentation/dto/transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectQueue('transaction') private transactionQueue: Queue,
  ) {}

  public async saveChunks(transactionChunks: TransactionDto[][]) {
    for (const chunk of transactionChunks) {
      await this.transactionQueue.add({ transactions: chunk });
    }
  }
}
