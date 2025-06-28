import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateCardDto {
  @ApiProperty({
    type: String,
    description: 'Unique identifier for the card, typically a UUID',
    required: true,
    enum: ['debit', 'credit'],
  })
  @IsString()
  @IsEnum(['debit', 'credit'])
  type: 'debit' | 'credit';

  @ApiProperty({
    type: String,
    description: 'Name of the card',
    required: true,
    maxLength: 30,
  })
  @IsString()
  @MaxLength(30)
  card_name: string;

  @ApiProperty({
    type: String,
    description: 'Card number, last 4 digits',
    required: true,
    maxLength: 4,
    minLength: 4,
  })
  @IsString()
  @MaxLength(4)
  card_number: string;

  @ApiProperty({
    type: Number,
    description: 'Current balance of the card, applicable for credit cards',
    required: false,
    default: 0,
    minimum: 0,
    maximum: 1000000, // Assuming a maximum balance limit
    example: 1000,
  })
  @IsPositive()
  balance?: number;

  @ApiProperty({
    type: Number,
    description: 'Credit limit for the card, applicable for credit cards',
    required: false,
    default: 0,
    minimum: 0,
    maximum: 1000000, // Assuming a maximum credit limit
    example: 5000,
  })
  @IsNumber()
  credit_limit?: number;

  @ApiProperty({
    type: String,
    description: 'Unique identifier for the account associated with the card',
    required: true,
  })
  @IsString()
  @IsUUID()
  accountId: string; // Assuming accountId is a string representing the account's ID
}
