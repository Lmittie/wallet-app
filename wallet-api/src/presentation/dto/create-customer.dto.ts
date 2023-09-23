import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  public _id: string;

  @IsNotEmpty()
  @IsString()
  public first_name: string;

  @IsNotEmpty()
  @IsString()
  public last_name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public balance: number;
}
