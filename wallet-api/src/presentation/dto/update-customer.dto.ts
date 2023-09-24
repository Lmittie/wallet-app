import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiProperty({ example: 'Alex' })
  @IsNotEmpty()
  @IsString()
  public first_name: string;

  @ApiProperty({ example: 'Smith' })
  @IsNotEmpty()
  @IsString()
  public last_name: string;

  @ApiProperty({ example: 5000, minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public balance: number;
}
