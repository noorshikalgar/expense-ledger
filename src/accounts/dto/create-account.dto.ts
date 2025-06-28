import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, MaxLength } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    description: "Name of the account.",
    example: "Bank Account"
  })
  @IsString()
  @MaxLength(100)
  name: string;
  @ApiProperty({
    description: "Description for the account.",
    example: "This is my savings account."
  })
  @IsString()
  @MaxLength(512)
  description: string;
  @ApiProperty({
    description: "Current available balance for tracking.",
    example: 12000
  })
  @IsNumber()
  @Max(999999999)
  balance: number;
}
