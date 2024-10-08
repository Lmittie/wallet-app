import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import * as schema from '../schemas';
import * as view from '../../presentation/views';
import { CreateCustomerDto } from '../../presentation/dto/create-customer.dto';
import { UpdateCustomerDto } from '../../presentation/dto/update-customer.dto';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectModel(schema.Customer.name)
    private customerModel: Model<schema.Customer>,
  ) {}

  public async create(createCustomerDto: CreateCustomerDto): Promise<view.Customer> {
    try {
      const customer = new this.customerModel(createCustomerDto);
      await customer.save();

      return this.toView(customer);
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      if (error.code && error.code == 11000) {
        throw new BadRequestException('Duplicate identifier');
      }

      console.log(error);
      throw new InternalServerErrorException(`Unexpected error occurred: ${error.message}`);
    }
  }

  public async get(id: string): Promise<view.Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found.`);
    }

    return this.toView(customer);
  }

  public async update(id: string, customerDto: UpdateCustomerDto): Promise<view.Customer> {
    const customer = await this.customerModel.findOneAndUpdate({ _id: id }, customerDto, { new: true });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found.`);
    }

    return this.toView(customer as HydratedDocument<schema.Customer>);
  }

  public async delete(id: string): Promise<void> {
    const customer = await this.customerModel.findOneAndDelete({ _id: id });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found.`);
    }
  }

  private toView(customerDbModel: HydratedDocument<schema.Customer>): view.Customer {
    return {
      _id: customerDbModel._id,
      first_name: customerDbModel.first_name,
      last_name: customerDbModel.last_name,
      balance: customerDbModel.balance,
    };
  }
}
