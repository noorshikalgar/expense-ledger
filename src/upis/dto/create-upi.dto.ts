import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateUpiDto {
  @ApiProperty({
    description: 'Provide you upi id.',
    type: 'string',
    example: 'myupi@xyz',
    required: true,
  })
  @IsString()
  @MaxLength(50)
  upi: string;

  @ApiProperty({
    description: 'Provide you account id.',
    type: 'string',
    required: true,
  })
  @IsUUID()
  account_id: string;

  @ApiProperty({
    description: 'True if your account is deleted or need to be deleted',
    type: 'boolean',
    default: false,
    required: true,
  })
  @IsOptional()
  @IsBoolean()
  is_delete: boolean;
}
