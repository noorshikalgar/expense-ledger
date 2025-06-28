import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a sample comment.',
    type: String,
    maxLength: 1024,
    minLength: 1,
    required: true,
    nullable: false,
  })
  @IsString()
  @MaxLength(1024)
  @MinLength(1)
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    description: 'The ID of the transaction to which this comment belongs',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true,
    nullable: false,
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: 'Indicates if the comment has been edited',
    example: false,
    type: Boolean,
    default: false,
    required: false,
    nullable: true,
  })
  @IsBoolean()
  is_edited?: boolean;
  @ApiProperty({
    description: 'Indicates if the comment has been deleted',
    example: false,
    type: Boolean,
    default: false,
    required: false,
    nullable: true,
  })
  @IsBoolean()
  is_deleted?: boolean;
}
