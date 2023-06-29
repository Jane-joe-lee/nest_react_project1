import {
    Body, Get, Post, Param, Patch, Delete, Controller, Query,
    ParseIntPipe, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe
} from '@nestjs/common';
import { BoardsService } from "./boards.service";
import { BoardStatus, BoardType } from "./boards.default_type";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { SearchBoardDto } from "./dto/search-board.dto";
import { BoardStatusValidationPipe } from "./pipes/board-status-validation.pipe";
import { BoardTypeValidationPipe } from "./pipes/board-type-validation.pipe";
import { Board } from "./board.entity";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "../auth/entity/user.entity";
import { BoardResponseDto } from "./dto/board.response.dto";
import { FilesInterceptor } from '@nestjs/platform-express'; // FileInterceptor
import { multerOptions } from "../common/utils/multer.options";
//import { CreateSwaggerDto } from "./dto/create-swagger.dto";

@ApiTags('boards')
@Controller('boards')
export class BoardsController {
    constructor(private boardsService: BoardsService) {}

    @ApiOperation( { summary: '게시물 생성(인증 필수)'} )
    //@ApiOkResponse({description: 'Success'})
    //@ApiResponse({status: 401, description: 'unauthorized'})
    @Post('/create')
    @UsePipes(ValidationPipe)
    //@UseInterceptors(FileInterceptor('file', multerOptions('boards')))
    @UseInterceptors(FilesInterceptor('files', 10, multerOptions('boards')))
    @UseGuards(AuthGuard())
    createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user: User,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<boolean> { // Promise<Board>
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
    deleteBoard(@Param('id', ParseIntPipe) id, @GetUser() user: User): Promise<boolean> {
        return this.boardsService.deleteBoard(id, user);
    }

    @ApiOperation( { summary: '게시물 상태 업데이트(인증 필수)'} )
    @ApiParam({name: 'id', type: 'number'})
    //@ApiBody({description: '', type: CreateBoardDto})
    @Patch('/:id/status')
    @UseGuards(AuthGuard())
    updateBoardStatus(@Param('id', ParseIntPipe) id, @Body('status', BoardStatusValidationPipe) status: BoardStatus): Promise<boolean> {
        return this.boardsService.updateBoardStatus(id, status);
    }

    @ApiOperation( { summary: '좋아요 수 업데이트'} )
    @ApiParam({name: 'id', type: 'number'})
    //@ApiBody({description: '+/-', type: ''})
    @Patch('/:id/like')
    updateBoardLike(@Param('id', ParseIntPipe) id, @Body('like') like: string): Promise<boolean> {
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
        @Body() updateBoardDto: UpdateBoardDto,
        @GetUser() user: User,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<boolean> {
        return this.boardsService.updateBoard(id, updateBoardDto, user, 'boards', files);
    }


    @ApiOperation( { summary: '모든 게시물 확인'} )
    @ApiResponse({status: 201, description: 'Success', type: BoardResponseDto})
    @Get('/list/:type')
    getAllBoard(
        @Param('type', BoardTypeValidationPipe) type: BoardType,
        @Query() data: SearchBoardDto,
    ): Promise<Board[]> {
        return this.boardsService.getAllBoards(data, type);
    }

    /*
    @ApiOperation( { summary: '나의 모든 게시물 확인(인증 필수)' } )
    @ApiResponse({status: 201, description: 'Success', type: BoardResponseDto})
    //@ApiBody({ description: '검색어(제목)', type: SearchBoardDto })
    @Get('/myList')
    @UseGuards(AuthGuard())
    getMyAllBoards(
        @Query() data: SearchBoardDto,
        @GetUser() user: User): Promise<Board[]> {
        return this.boardsService.getMyAllBoards(data, user);
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
