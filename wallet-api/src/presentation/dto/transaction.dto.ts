import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class TransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public value: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public latency: number;

  @IsNotEmpty()
  @IsString()
  public customerId: string;
}
