import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Enter email or mobile number.',
    example: "911234567890"
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'Enter password.',
    example: "User@One#123"
  })
  @IsString()
  @MinLength(6)
  password: string;
}
