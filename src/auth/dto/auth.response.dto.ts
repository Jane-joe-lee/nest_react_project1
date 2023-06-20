import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {

    @ApiProperty({
        example: 'erinuwlrwhbijrewlnru.wrnoiewurw121o38noeenabjeoitnoielkwjnriuwnoriuwers.rrowinrvvwenoriuqomksjeJ',
        description: '인증 Token 값',
        required: true
    })
    @IsString()
    accessToken: string;

}