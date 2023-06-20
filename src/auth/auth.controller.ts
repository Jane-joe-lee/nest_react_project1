import {
    Body, Post, Get, Delete, Req, Param,
    Controller, HttpStatus,
    ParseFilePipeBuilder, ParseIntPipe,
    UploadedFile, UseGuards, UseInterceptors, ValidationPipe
} from '@nestjs/common';
import { AuthService } from "./auth.service";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./get-user.decorator";
import { User } from "./entity/user.entity";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthResponseDto } from "./dto/auth.response.dto";
//import {CreateBoardDto} from "../boards/dto/create-board.dto";
//import {Board} from "../boards/board.entity";
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from "../common/utils/multer.options";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation( { summary: '회원가입'} )
    @ApiResponse({status: 201, description: 'Success'})
    @ApiResponse({status: 409, description: 'Existing username'})
    @ApiResponse({status: 400, description: 'Bad Request(username/password must be longer than or equal to 4 characters)'})
    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.authService.signUp(authCredentialDto);
    }

    @ApiOperation( { summary: '로그인'} )
    @ApiResponse({status: 201, description: 'Success', type: AuthResponseDto})
    @ApiResponse({status: 401, description: 'Unauthorized(logIn failed, 존재하지 않는 ID/잘못된 비밀번호)'})
    @ApiResponse({status: 400, description: 'Bad Request(username/password must be longer than or equal to 4 characters)'})
    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto, @Req() req: Request): Promise<{accessToken: string}> {
        return this.authService.signIn(authCredentialDto, req);
    }


    @ApiOperation( { summary: 'test'} )
    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log('user', user);
    }

    @ApiOperation({ summary: '프로필 이미지 업데이트'})
    @Post('/profile')
    @UseInterceptors(FileInterceptor('file', multerOptions('profiles')))
    @UseGuards(AuthGuard())
    profileImg(
        @GetUser() user: User,
        @UploadedFile(
            new ParseFilePipeBuilder().addFileTypeValidator({fileType: 'jpeg|png|jpg|gif'}).build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
        ) file: Express.Multer.File
    ) {
        return this.authService.profileImg(user, 'profiles', file);
    }

    @ApiOperation({ summary: '프로필 이미지 삭제'})
    @Delete('/profile')
    @UseGuards(AuthGuard())
    profileImgDelete(@GetUser() user: User) {
        return this.authService.profileImgDelete(user);
    }

    @ApiOperation( { summary: '모든 회원정보 조회' })
    @Get('/allUsers')
    @UseGuards(AuthGuard())
    getAllUsers(@GetUser() user: User): Promise<User[]> {
        return this.authService.getAllUsers(user);
    }

    @ApiOperation( { summary: '회원정보 조회' })
    @ApiParam({name: 'id', type: 'number'})
    @Get('/oneUser/:id')
    @UseGuards(AuthGuard())
    getOneUser(@Param('id', ParseIntPipe) id, @GetUser() user: User): Promise<User> {
        return this.authService.getOneUser(user, id);
    }

    @ApiOperation( { summary: '내정보 조회' })
    @Get('/myinfo')
    @UseGuards(AuthGuard())
    getLoginUser(@GetUser() user: User): Promise<User> {
        return this.authService.getLoginUser(user);
    }


    @ApiOperation( { summary: '비밀번호 변경' })
    @Post('/setPassword')
    @UseGuards(AuthGuard())
    setPassword(@GetUser() user: User, @Body() body: any): Promise<boolean> {
        return this.authService.setPassword(user, body);
    }
}