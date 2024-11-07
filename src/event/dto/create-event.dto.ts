import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEventDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsString()
    startTime: string;

    @IsOptional()
    @IsString()
    endTime: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    location: string;

    @IsOptional()
    @IsInt()
    maxGuests: number;

    @IsNotEmpty()
    @IsInt()
    visibilityId: number;

    @IsOptional()
    @IsString()
    @MaxLength(400)
    theme: string;

    @IsOptional()
    cover: Buffer;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    ticketPrice: number;

    @IsOptional()
    @IsBoolean()
    allowPhotoUpload: boolean;

    @IsOptional()
    securityOptions: Record<string, any>;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    contactInfo: string;
}