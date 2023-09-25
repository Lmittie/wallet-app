import { Injectable } from '@nestjs/common';
import { orderBy, sortBy, sumBy } from 'lodash';

import { TransactionDto } from '../../presentation/dto/transaction.dto';
import { TransactionRepository } from '../../infrastructure/repositories/transaction.repository';

const LATENCY_MAX = 1000;

@Injectable()
export class TransactionUseCases {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  public async execute(transactions: TransactionDto[]) {
    const transactionChunks = this.splitIntoChunks(transactions);

    await this.transactionRepository.saveChunks(transactionChunks);
    this.logChunks(transactionChunks);
  }

  public splitIntoChunks(transactions: TransactionDto[]): TransactionDto[][] {
    const chunks: TransactionDto[][] = [];

    const sortedTransactions = orderBy(transactions, ['value', 'latency'], ['desc', 'asc']);

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

  private logChunks(transactionChunks: TransactionDto[][]): void {
    const messages = (transactionChunks.map(
      (chunk, index) => {
        const totalValue = sumBy(chunk, ({ value }) => value);
        const totalTime = sumBy(chunk, ({ latency }) => latency);
        const remainingTime = LATENCY_MAX - totalTime;
        return `chunk ${index + 1}:\n  transactions: ${JSON.stringify(chunk)}\n  total value:${totalValue}\n  time left:${remainingTime}`;
      }
    ));

    console.log(messages.join('\n'));
  }
}
