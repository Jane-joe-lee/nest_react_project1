import { PickType } from "@nestjs/swagger";
import { Board } from "../board.entity";

export class CreateBoardDto extends PickType(Board, ['type', 'title', 'description', 'attachedFile', 'status', 'parentId'] as const ) {
    /*
    @ApiProperty({
        example: '[공지사항] 점검 안내',
        description: '게시물 제목',
        required: true
    })
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: '점검 안내입니다.',
        description: '게시물 내용',
        required: true
    })
    @IsNotEmpty()
    description: string;
    */
}
