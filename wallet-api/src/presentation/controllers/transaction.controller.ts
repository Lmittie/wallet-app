import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiKeyAuthGuard } from '../guards/api-key-auth.guard';
import { TransactionUseCases } from '../../use-cases/transaction.use-cases';
import { TransactionDto } from '../dto/transaction.dto';

@Controller('transaction')
@ApiTags('Transaction')
export class TransactionController {
  constructor(private readonly transactionUseCases: TransactionUseCases) {}

  @Post()
  @UseGuards(ApiKeyAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Process customers transactions.' })
  @ApiBody({ type: [TransactionDto] })
  @ApiHeader({ name: 'X-API-KEY', description: 'Api key authorization header' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiBadRequestResponse()
  public async execute(@Body() transactions: TransactionDto[]) {
    await this.transactionUseCases.execute(transactions);
  }
}
