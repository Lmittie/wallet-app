import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ApiKeyAuthGuard } from '../guards/api-key-auth.guard';
import { TransactionUseCases } from '../../use-cases/transaction.use-cases';
import { TransactionDto } from '../dto/transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionUseCases: TransactionUseCases) {}

  @Post()
  @UseGuards(ApiKeyAuthGuard)
  public async execute(@Body() transactions: TransactionDto[]) {
    await this.transactionUseCases.execute(transactions);
  }
}
