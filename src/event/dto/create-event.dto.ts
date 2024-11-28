import { IsBoolean, IsDateString, IsInt, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, isString, IsString, MaxLength } from 'class-validator';

export class CreateEventDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @IsNotEmpty()
    creatorId: number;

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
    cover: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    imageFormat: string;

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