import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateHelperDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    eventId: string;

    @IsNotEmpty()
    @IsInt()
    userId: number;

    @IsNotEmpty()
    @IsInt()
    permissionId: number;
}
