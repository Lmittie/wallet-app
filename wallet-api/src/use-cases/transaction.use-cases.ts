import { Injectable } from '@nestjs/common';
import { chain, orderBy, sumBy } from 'lodash';

import { TransactionDto } from '../presentation/dto/transaction.dto';
import { TransactionRepository } from '../infrastructure/transaction.repository';

const LATENCY_MAX = 1000;

@Injectable()
export class TransactionUseCases {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  public async execute(transactions: TransactionDto[]) {
    const transactionChunks = this.createChunks(transactions);

    console.log(transactionChunks);
    await this.transactionRepository.saveChunks(transactionChunks);
  }

  private createChunks(transactions: TransactionDto[]): TransactionDto[][] {
    const chunks: TransactionDto[][] = [];

    const sortedTransactions = chain(transactions)
      .orderBy(({ value }) => value, 'desc')
      .orderBy(({ latency }) => latency, 'desc')
      .value();

    for (const transaction of sortedTransactions) {
      const availableChunk = chunks.find(chunk => {
        const chunkLatencySum = sumBy(chunk, ({ latency }) => latency);

        return chunkLatencySum + transaction.latency <= LATENCY_MAX;
      });
      if (availableChunk) {
        availableChunk.push(transaction);
      } else {
        chunks.push([transaction]);
      }
    }

    return orderBy(
      chunks,
      chunk => sumBy(chunk, ({ value }) => value),
      'desc',
    );
  }
}
