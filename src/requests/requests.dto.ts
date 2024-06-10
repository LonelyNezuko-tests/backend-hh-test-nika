import { IsEmail, IsIn, IsString, Length } from "class-validator";
import { RequestEntityStatus } from "./requests.entity";

export class RequestsCreateDTO {
    @IsString()
    @Length(4, 32)
    name: string

    @IsEmail()
    email: string

    @IsString()
    @Length(10, 1024)
    message: string
}

export class RequestsUpdateDTO {
    @IsString()
    @Length(10, 1024)
    comment: string

    @IsString()
    @IsIn([ "resolved", "denied" ])
    status: RequestEntityStatus
}