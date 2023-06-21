import { ApiProperty } from "@nestjs/swagger";

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
}