import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateTicketDto {
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    eventId: string;

    @IsInt()
    @IsOptional()
    userId: number;

    @IsString()
    @MaxLength(10)
    @IsOptional()
    code: string;

    @IsOptional()
    @IsInt()
    statusId: number;
}
