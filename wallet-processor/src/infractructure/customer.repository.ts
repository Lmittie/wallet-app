import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Customer } from './customer.schema';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<Customer>,
  ) {}

  public async get(id: string): Promise<Customer | undefined> {
    return this.customerModel.findById(id).exec();
  }

  public async updateBalance(id: string, balance: number): Promise<void> {
    await this.customerModel.updateOne({ _id: id }, { balance });
  }
}
