import { ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "../entity/user.entity";
//import { IsString, Matches, MaxLength, MinLength } from "class-validator";


export class AuthCredentialDto extends PickType(User, ['username', 'password'] as const) {
    /*
    @ApiProperty({
        example: 'user1',
        description: '사용자 이름',
        required: true
    })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @ApiProperty({
        example: '1329wbiue1n',
        description: '비밀번호',
        required: true
    })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number'
    })
    password: string;
    */
}