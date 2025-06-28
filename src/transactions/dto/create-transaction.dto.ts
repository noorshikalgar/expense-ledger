import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Comment } from 'src/comments/entities/comment.entity';
import { Nature, Type } from '../models/transaction.model';
import { Transform } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    type: String,
    description: 'Nature of the transaction',
    enum: Nature,
  })
  @IsEnum(Nature)
  nature: Nature;

  @ApiProperty({
    description: 'Type of the transaction.',
    enum: Type,
  })
  @IsEnum(Type)
  type: Type;

  @ApiProperty({
    type: 'string',
  })
  @IsUUID()
  category_id: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({
    type: 'number'
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  account_id: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  card_id?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  upi_id?: string;

  @ApiProperty({
    type: String,
    required: false,
    items: { format: 'uuid' },
    isArray: true,
  })
  @IsOptional()
  @IsEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsUUID('all', { each: true })
  split_users?: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    items: { format: 'uuid' },
    required: false,
  })
  @IsOptional()
  @IsEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsUUID('all', { each: true })
  files?: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    items: { format: 'uuid' },
    required: false,
  })
  @IsOptional()
  @IsEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsUUID('all', { each: true })
  comments?: string[];

  @ApiProperty({
    description: '',
    required: true,
  })
  @Transform(({ value }) => {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date().getTime() : date; // Handle invalid date strings gracefully
  })
  @IsNotEmpty()
  @IsDate()
  transaction_date: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_paid: boolean;
}
