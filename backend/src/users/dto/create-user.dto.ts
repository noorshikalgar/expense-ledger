import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional, isStrongPassword, IsStrongPassword, MaxLength, IsPhoneNumber, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsPhoneNumber("IN", {
    message: "Invalid mobile number."
  })
  mobile: string;
  
  @ApiProperty({
    required: false
  })
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;
}
