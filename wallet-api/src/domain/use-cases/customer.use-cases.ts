import { Injectable } from '@nestjs/common';

import { UpdateCustomerDto } from '../../presentation/dto/update-customer.dto';
import { CreateCustomerDto } from '../../presentation/dto/create-customer.dto';
import { CustomerRepository } from '../../infrastructure/repositories/customer.repository';
import * as view from '../../presentation/views';

@Injectable()
export class CustomerUseCases {
  constructor(private readonly customerRepository: CustomerRepository) {}

  public async get(id: string): Promise<view.Customer> {
    return await this.customerRepository.get(id);
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
