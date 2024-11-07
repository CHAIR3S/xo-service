import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTicketDto {
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    eventId: string;

    @IsInt()
    userId: number;

    @IsString()
    @MaxLength(10)
    code: string;

    @IsOptional()
    @IsInt()
    statusId: number;
}
