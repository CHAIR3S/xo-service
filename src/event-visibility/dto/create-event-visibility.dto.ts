import { IsString, Length } from "class-validator";

export class CreateEventVisibilityDto {

    @IsString()
    @Length(1,50)
    name: string;

}
