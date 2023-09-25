import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse, ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CustomerUseCases } from '../../domain/use-cases/customer.use-cases';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { IsAuthorized } from '../decorators/is-authorized';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { ApiKeyAuthGuard } from '../middlewares/api-key-auth.guard';
import { ParseObjectIdPipe } from '../middlewares/object-id-validation.pipe';
import * as view from '../views';

@Controller('customer')
@ApiTags('Customer')
export class CustomerController {
  constructor(private readonly customerUseCases: CustomerUseCases) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Return full customer information if called with api key. If api key is not provided, returns only customer name.',
  })
  @ApiHeader({ name: 'X-API-KEY', description: 'Api key authorization header' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiOkResponse({ type: view.Customer })
  @ApiResponse({ status: HttpStatus.PARTIAL_CONTENT, type: view.PartialCustomer })
  @ApiBadRequestResponse()
  public async get(
    @Param('id', ParseObjectIdPipe) id: string,
    @IsAuthorized() isAuthorized: boolean,
    @Res() response: Response,
  ): Promise<void> {
    const customer = await this.customerUseCases.get(id);

    if (isAuthorized) {
      response
        .status(HttpStatus.OK)
        .send(customer);
    } else {
      const { balance, ...partialCustomer } = customer;
      response
        .status(HttpStatus.PARTIAL_CONTENT)
        .send({ ...partialCustomer });
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create customer.' })
  @UseGuards(ApiKeyAuthGuard)
  @ApiHeader({ name: 'X-API-KEY', description: 'Api key authorization header' })
  @ApiCreatedResponse({ type: view.Customer })
  @ApiResponse({ status: 401, description: 'Unauthorized. Api key required.' })
  @ApiBadRequestResponse()
  public async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<view.Customer> {
    return this.customerUseCases.create(createCustomerDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customers name and balance.' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiOkResponse({ type: view.Customer })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  public async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<view.Customer> {
    return this.customerUseCases.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  public async delete(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    await this.customerUseCases.delete(id);
  }
}
