import { IsMongoId, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({ example: 500, minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public value: number;

  @ApiProperty({ example: 1000, minimum: 0, maximum: 1000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000)
  public latency: number;

  @ApiProperty({ description: 'MongoDB ObjectId', example: '65109dd4117212e6c194de44' })
  @IsNotEmpty()
  @IsMongoId()
  public customerId: string;
}
