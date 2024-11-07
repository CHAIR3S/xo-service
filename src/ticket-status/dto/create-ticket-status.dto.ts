import { IsString, Length } from "class-validator";

export class CreateTicketStatusDto {

    @IsString()
    @Length(1,50)
    name: string;
    
}
