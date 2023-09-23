import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateCustomerDto {
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
