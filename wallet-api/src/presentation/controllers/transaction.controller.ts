import { Controller, Post, UseGuards } from '@nestjs/common';

import { ApiKeyAuthGuard } from '../guards/api-key-auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor() {}

  @Post()
  @UseGuards(ApiKeyAuthGuard)
  public async executeTransaction() {

  }
}
