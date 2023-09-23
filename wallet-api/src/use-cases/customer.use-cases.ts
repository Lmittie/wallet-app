import { Injectable } from '@nestjs/common';

import { UpdateCustomerDto } from '../presentation/dto/update-customer.dto';
import { CreateCustomerDto } from '../presentation/dto/create-customer.dto';
import { CustomerRepository } from '../infrastructure/customer.repository';
import * as view from '../presentation/views';

@Injectable()
export class CustomerUseCases {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async get(id: string, isAuthorized: boolean): Promise<view.Customer> {
    const customer = await this.customerRepository.get(id);
    if (isAuthorized) {
      return customer;
    }

    const { _id, first_name, last_name } = customer;
    return { _id, first_name, last_name };
  }

  public async create(customer: CreateCustomerDto): Promise<view.Customer> {
    return this.customerRepository.create(customer);
  }

  public async update(id: string, customer: UpdateCustomerDto): Promise<view.Customer> {
    return this.customerRepository.update(id, customer);
  }

  public async delete(id: string) {
    return this.customerRepository.delete(id);
  }
}
