import { ApiProperty, OmitType } from '@nestjs/swagger';

export class Customer {
  @ApiProperty({ description: 'MongoDB ObjectId', example: '65109dd4117212e6c194de44' })
  public _id: string;

  @ApiProperty({ example: 'Alex' })
  public first_name: string;

  @ApiProperty({ example: 'Smith' })
  public last_name: string;

  @ApiProperty({ example: 5000 })
  public balance: number;
}

export class PartialCustomer extends OmitType(Customer, ['balance'] as const) {}