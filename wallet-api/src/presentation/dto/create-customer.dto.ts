import { IsNotEmpty, IsNumber, IsString, IsMongoId, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'MongoDB ObjectId', example: '65109dd4117212e6c194de44' })
  @IsMongoId()
  @IsNotEmpty()
  public _id: string;

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
