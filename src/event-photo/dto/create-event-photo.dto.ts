import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventPhotoDto {

    @IsNotEmpty()
    @IsString()
    eventId: string;

    @IsNotEmpty()
    @IsInt()
    uploadedBy: number;

    @IsNotEmpty()
    @IsString()
    photo: string;
}
