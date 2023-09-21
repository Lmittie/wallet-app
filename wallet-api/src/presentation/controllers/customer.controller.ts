import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';

import { CustomerUseCases } from '../../use-cases/customer.use-cases';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { IsAuthorized } from '../decorators/is-authorized';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerUseCases: CustomerUseCases) {}

  @Get(':id')
  public async get(@Param('id') id: string, @IsAuthorized() isAuthorized: boolean) {
    return this.customerUseCases.get(id, isAuthorized);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerUseCases.update(id, updateCustomerDto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return this.customerUseCases.delete(id);
  }
}
