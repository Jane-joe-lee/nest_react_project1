import {
    Body,
    Controller,
    Delete, FileTypeValidator,
    Get, HttpStatus, MaxFileSizeValidator,
    Param, ParseFilePipe, ParseFilePipeBuilder,
    ParseIntPipe,
    Patch,
    Post, UploadedFile, UploadedFiles, UseFilters, UseGuards, UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { BoardsService } from "./boards.service";
import { BoardStatus } from "./board-status.enum";
import { CreateBoardDto } from "./dto/create-board.dto";
import { BoardStatusValidationPipe } from "./pipes/board-status-validation.pipe";
import { Board } from "./board.entity";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "../auth/entity/user.entity";
import { BoardResponseDto } from "./dto/board.response.dto";
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from "../common/utils/multer.options";

//import { CreateSwaggerDto } from "./dto/create-swagger.dto";

@ApiTags('boards')
@Controller('boards')
export class BoardsController {
    constructor(private boardsService: BoardsService) {}

    @ApiOperation( { summary: '게시물 생성(인증 필수)'} )
    //@ApiOkResponse({description: 'Success'})
    //@ApiResponse({status: 401, description: 'unauthorized'})
    @Post()
    @UsePipes(ValidationPipe)
    //@UseInterceptors(FileInterceptor('file', multerOptions('boards')))
    @UseInterceptors(FilesInterceptor('files', 10, multerOptions('boards')))
    @UseGuards(AuthGuard())
    createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user: User,
        @UploadedFiles(
            new ParseFilePipeBuilder().addFileTypeValidator({fileType: 'jpeg|png|jpg|gif'}).build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
        ) files: Array<Express.Multer.File>
    ): Promise<Board> {
        return this.boardsService.createBoard(createBoardDto, user, 'boards', files);
    }

    @ApiOperation({ summary: '게시물 1개 확인' })
    @ApiParam({name: 'id', type: 'number'})
    @Get('/:id')
    getBoardById(@Param('id') id: number): Promise<Board> {
        return this.boardsService.getBoardById(id);
    }

    @ApiOperation( { summary: '게시물 삭제(인증 필수)'} )
    @ApiParam({name: 'id', type: 'number'})
    @Delete('/:id')
    @UseGuards(AuthGuard())
    deleteBoard(@Param('id', ParseIntPipe) id, @GetUser() user: User): Promise<void> {
        return this.boardsService.deleteBoard(id, user);
    }

    @ApiOperation( { summary: '게시물 상태 업데이트(인증 필수)'} )
    @ApiParam({name: 'id', type: 'number'})
    //@ApiBody({description: '', type: CreateBoardDto})
    @Patch('/:id/status')
    @UseGuards(AuthGuard())
    updateBoardStatus(@Param('id', ParseIntPipe) id, @Body('status', BoardStatusValidationPipe) status: BoardStatus) {
        return this.boardsService.updateBoardStatus(id, status);
    }

    @ApiOperation( { summary: '좋아요 수 업데이트'} )
    @ApiParam({name: 'id', type: 'number'})
    //@ApiBody({description: '+/-', type: ''})
    @Patch('/:id/like')
    updateBoardLike(@Param('id', ParseIntPipe) id, @Body('like') like: string): Promise<Board> {
        return this.boardsService.updateBoardLike(id, like);
    }

    @ApiOperation( { summary: '게시물 수정'} )
    @ApiParam({name: 'id', type: 'number'})
    //@ApiBody({description: '', type: CreateBoardDto})
    @Patch('/:id')
    @UseInterceptors(FilesInterceptor('files', 10, multerOptions('boards')))
    @UseGuards(AuthGuard())
    updateBoard(
        @Param('id', ParseIntPipe) id,
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user: User,
        @UploadedFiles(
            new ParseFilePipeBuilder().addFileTypeValidator({fileType: 'jpeg|png|jpg|gif'}).build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
        ) files: Array<Express.Multer.File>
    ): Promise<Board> {
        return this.boardsService.updateBoard(id, createBoardDto, user, 'boards', files);
    }


    @ApiOperation( { summary: '모든 게시물 확인'} )
    @ApiResponse({status: 201, description: 'Success', type: BoardResponseDto})
    @Get()
    getAllBoard(): Promise<Board[]> {
        return this.boardsService.getAllBoards();
    }
    /*
    @ApiOperation( { summary: '나의 모든 게시물 확인(인증 필수)' } )
    @ApiResponse({status: 201, description: 'Success', type: BoardResponseDto})
    @Get()
    @UseGuards(AuthGuard())
    getMyAllBoards(@GetUser() user: User): Promise<Board[]> {
        return this.boardsService.getMyAllBoards(user);
    }
    */

    /*
    @Get()
    getAllBoard(): Board[] {
        return this.boardsService.getAllBoards();
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(@Body() createBoardDto: CreateBoardDto): Board {
        return this.boardsService.createBoard(createBoardDto);
    }

    @Get('/:id')
    getBoardById(@Param('id') id: string): Board {
        return this.boardsService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(@Param('id') id: string): void {
        this.boardsService.deleteBoard(id);
    }

    @Patch('/:id/status')
    updateBoardStatus(@Param('id') id: string, @Body('status', BoardStatusValidationPipe) status: BoardStatus) {
        return this.boardsService.updateBoardStatus(id, status);
    }*/

}
