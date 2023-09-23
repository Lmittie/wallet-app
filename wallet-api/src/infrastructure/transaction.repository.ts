import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { TransactionDto } from '../presentation/dto/transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(@InjectQueue('transaction') private transactionQueue: Queue) {
    this.init();
  }

  public async saveChunks(transactionChunks: TransactionDto[][]) {
    for (const chunk of transactionChunks) {
      await this.transactionQueue.add({ transactions: chunk });
    }
  }

  async init() {
    try {
      await this.delay(1000, 1);
      this.checkQueueAvailability();
    } catch (e) {
      console.error(e);
    }
  }

  private checkQueueAvailability(): void {
    if (this.transactionQueue.client.status === "ready") {
      console.log("Redis is ready");
    } else {
      throw new Error("Redis not available");
    }
  }

  delay(t: number, val: any) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(val);
      }, t);
    });
  }
}