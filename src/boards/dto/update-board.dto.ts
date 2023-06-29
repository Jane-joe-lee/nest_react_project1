import {ApiProperty, PickType} from "@nestjs/swagger";
import { Board } from "../board.entity";

export class UpdateBoardDto extends PickType(Board, ['type', 'title', 'description', 'attachedFile', 'status', 'parentId'] as const ) {

    @ApiProperty({
        example: 'boards/a.png|boards/b.jpg',
        description: '이전 첨부파일명'
    })
    oldFileNames: string;

}
