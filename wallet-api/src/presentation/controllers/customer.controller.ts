import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { CustomerUseCases } from '../../use-cases/customer.use-cases';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { IsAuthorized } from '../decorators/is-authorized';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { ApiKeyAuthGuard } from '../guards/api-key-auth.guard';
import * as view from '../views';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerUseCases: CustomerUseCases) {}

  @Get(':id')
  public async get(
    @Param('id') id: string,
    @IsAuthorized() isAuthorized: boolean,
  ) {
    return this.customerUseCases.get(id, isAuthorized);
  }

  @Post()
  @UseGuards(ApiKeyAuthGuard)
  public async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<view.Customer> {
    return this.customerUseCases.create(createCustomerDto);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<view.Customer> {
    return this.customerUseCases.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.customerUseCases.delete(id);
  }
}
