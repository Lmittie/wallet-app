import { Injectable } from '@nestjs/common';

import { UpdateCustomerDto } from '../presentation/dto/update-customer.dto';

@Injectable()
export class CustomerUseCases {
  constructor() {}

  public async get(id: string, isAuthorized: boolean) {
    if (isAuthorized) {
      // return full user info
    }
    // return only name
  }

  public async update(id: string, customer: UpdateCustomerDto) {

  }

  public async delete(id: string) {

  }
}
