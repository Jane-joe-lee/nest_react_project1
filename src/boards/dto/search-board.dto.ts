import { ApiProperty } from "@nestjs/swagger";
import { BoardType } from "../boards.default_type";

export class SearchBoardDto {

    @ApiProperty({
        example: 'title',
        description: '검색할 조건'
    })
    searchType: string;

    @ApiProperty({
        example: 'Hello',
        description: '검색할 게시물 제목'
    })
    searchWords: string;

    @ApiProperty({
        example: '1',
        description: '페이지번호'
    })
    page: number;

    @ApiProperty({
        example: '20',
        description: '한페이지당 보여줄 게시물 수'
    })
    pageCnt: number;

    @ApiProperty({
        example: '20',
        description: '게시판 유형'
    })
    type: BoardType;
}