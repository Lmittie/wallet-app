import { Injectable } from '@nestjs/common';

import { CustomerRepository } from '../infractructure/customer.repository';

@Injectable()
export class CustomerUseCases {
  constructor(
    private readonly customerRepository: CustomerRepository,
  ) {}

  public async subtractFromBalance(customerId: string, subtractValue: number): Promise<void> {
    const customer = await this.customerRepository.get(customerId);
    if (!customer) {
      console.log(`Customer with id ${customerId} doest not exist.`);
    } else {
      const newBalance = customer.balance - subtractValue;

      if (newBalance < 0) {
        console.log(`Customer "${customerId}": Cannot subtract money from balance.\nCustomer balance: ${customer.balance}\nSubtract value: ${subtractValue}`);
      } else {
        console.log(`Customer "${customerId}":\nOld balance: ${customer.balance}\nNew balance: ${newBalance}`);
        await this.customerRepository.updateBalance(customerId, newBalance);
      }
    }
  }
}
