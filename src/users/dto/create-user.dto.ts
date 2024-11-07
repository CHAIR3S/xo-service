import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'Juan Pérez' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;
  
    @ApiProperty({ example: 'juanperez' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    username: string;
  
    @ApiProperty({ example: 'juanperez@example.com' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @IsEmail()
    email: string;
  
    @ApiProperty({ example: 'password123' })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(255)
    password: string;
  
    @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
    @IsOptional()
    @IsString()
    profilePicture?: string;
  
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    roleId: number;
  
    @ApiProperty({ example: '123456', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(6)
    verificationCode?: string;
  
    @ApiProperty({ example: true, required: false })
    @IsOptional()
    isVerified?: boolean;
}
