import { OmitType } from "@nestjs/swagger";
import { Board } from "../board.entity";


export class BoardResponseDto extends OmitType(Board, ['user'] as const) {
    /*
    @ApiProperty({
        example: '112',
        description: '게시물 고유 번호',
        required: true
    })
    @IsNumber()
    id: number;

    @ApiProperty({
        example: BoardStatus.PUBLIC,
        description: `게시물 공개 상태 (${BoardStatus.PUBLIC}, ${BoardStatus.PRIVATE})`,
        required: true
    })
    status: BoardStatus;
    */
}