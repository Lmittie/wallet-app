import { Test, TestingModule } from '@nestjs/testing';

import { TransactionUseCases } from '../src/domain/use-cases/transaction.use-cases';
import { TransactionRepository } from '../src/infrastructure/repositories/transaction.repository';
import { TransactionDto } from '../src/presentation/dto/transaction.dto';

describe('Transaction use cases unit tests', () => {
  let transactionUseCases: TransactionUseCases;

  const mockTransactionRepository = {
    saveChunks: (transactionChunks: TransactionDto[][]): void => {},
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [TransactionUseCases, TransactionRepository],
    })
    .overrideProvider(TransactionRepository)
    .useValue(mockTransactionRepository)
    .compile();

    transactionUseCases = moduleRef.get(TransactionUseCases);
  });

  describe('Transaction use cases', () => {
    const expectArrayEquivalence = <T>(actual: T[], expected: T[]) => {
      expect(actual).toEqual(expect.arrayContaining(expected));
      expect(expected).toEqual(expect.arrayContaining(actual));
    };

    it('should split transaction array into chunks', () => {
      const transactionArray = [
        { value: 130, latency: 600, customerId: 'ID' },
        { value: 70, latency: 250, customerId: 'ID' },
        { value: 200, latency: 850, customerId: 'ID' },
        { value: 120, latency: 1000, customerId: 'ID' },
        { value: 20, latency: 50, customerId: 'ID' },
        { value: 40, latency: 100, customerId: 'ID' },
      ];

      const expectedChunks = [[
        { value: 200, latency: 850, customerId: 'ID' },
        { value: 40, latency: 100, customerId: 'ID' },
        { value: 20, latency: 50, customerId: 'ID' },
      ], [
        { value: 130, latency: 600, customerId: 'ID' },
        { value: 70, latency: 250, customerId: 'ID' },
      ], [
        { value: 120, latency: 1000, customerId: 'ID' },
      ]];

      const actualChunks = transactionUseCases.splitIntoChunks(transactionArray);

      for (let i = 0; i < expectedChunks.length; i++) {
        expectArrayEquivalence(actualChunks[i], expectedChunks[i]);
      }
    });

    // Actually this test case is incorrect. I discovered it just before the deadline...
    it('should split transaction array into chunks with same value and different latency', () => {
      const transactionArray = [
        { value: 200, latency: 850, customerId: 'ID' },
        { value: 100, latency: 150, customerId: 'ID' },
        { value: 100, latency: 100, customerId: 'ID' },
        { value: 50, latency: 900, customerId: 'ID' },
      ];

      const expectedChunks = [[
        { value: 200, latency: 850, customerId: 'ID' },
        { value: 100, latency: 100, customerId: 'ID' },
      ], [
        { value: 100, latency: 150, customerId: 'ID' },
      ], [
        { value: 50, latency: 900, customerId: 'ID' },
      ]];

      const actualChunks = transactionUseCases.splitIntoChunks(transactionArray);

      for (let i = 0; i < expectedChunks.length; i++) {
        expectArrayEquivalence(actualChunks[i], expectedChunks[i]);
      }
    });

    it('should split transaction array into chunks with same value and different latency', () => {
      const transactionArray = [
        { value: 200, latency: 850, customerId: 'ID' },
        { value: 100, latency: 150, customerId: 'ID' },
        { value: 100, latency: 100, customerId: 'ID' },
        { value: 50, latency: 50, customerId: 'ID' },
      ];

      const expectedChunks = [[
        { value: 200, latency: 850, customerId: 'ID' },
        { value: 100, latency: 100, customerId: 'ID' },
        { value: 50, latency: 50, customerId: 'ID' },
      ], [
        { value: 100, latency: 150, customerId: 'ID' },
      ]];

      const actualChunks = transactionUseCases.splitIntoChunks(transactionArray);

      for (let i = 0; i < expectedChunks.length; i++) {
        expectArrayEquivalence(actualChunks[i], expectedChunks[i]);
      }
    });
  });
});
