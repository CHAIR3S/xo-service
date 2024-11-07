import { IsString, Length } from "class-validator";

export class CreateHelperPermissionDto {

    @IsString()
    @Length(1,50)
    name: string;

}
