import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import { BoardStatus } from "./board-status.enum";
import { User } from "../auth/entity/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {JoinColumn} from "typeorm/browser";

@Entity()
export class Board extends BaseEntity {

    @ApiProperty({
        example: '112',
        description: '게시물 고유 번호',
        required: true
    })
    @IsNumber()
    @PrimaryGeneratedColumn({ comment: '고유번호'})
    id: number;

    @ApiProperty({
        example: '112',
        description: '부모 게시물 고유 번호'
    })
    @Column({ nullable: true, comment: '부모 고유번호' })
    parentId: number;

    @ManyToOne(() => Board, board => board.subBoards)
    parent: Board;

    @OneToMany(() => Board, board => board.parent)
    subBoards: Board[]

    @ApiProperty({
        example: '[공지사항] 점검 안내',
        description: '게시물 제목',
        required: true
    })
    @IsNotEmpty()
    @Column({ comment: '게시물제목' })
    title: string;


    @ApiProperty({
        example: '점검 안내입니다.',
        description: '게시물 내용',
        required: true
    })
    @IsNotEmpty()
    @Column({ comment: '내용' })
    description: string;

    @ApiProperty({
        example: BoardStatus.PUBLIC,
        description: `게시물 공개 상태 (${BoardStatus.PUBLIC}, ${BoardStatus.PRIVATE})`,
        required: true
    })
    @Column({ comment: `게시물 공개 상태 (${BoardStatus.PUBLIC}, ${BoardStatus.PRIVATE})`})
    status: BoardStatus;

    @ManyToOne(type => User, user => user.boards, {eager: false})
    user: User;

    @ApiProperty({
        example: 1,
        description: '댓글수'
    })
    @IsNumber()
    @Column({ default: 0, comment: '댓글수' })
    replyCnt: number;

    @ApiProperty({
        example: 1,
        description: '좋아요수'
    })
    @IsNumber()
    @Column({ default: 0, comment: '좋아요수' })
    likeCnt: number;

    @ApiProperty({
        example: 1,
        description: '조회수'
    })
    @IsNumber()
    @Column({ default: 0, comment: '조회수' })
    hitCnt: number;

    @ApiProperty({
        example: 'test.jpg',
        description: '첨부파일'
    })
    @Column({ nullable: true, comment: '첨부파일명(,로 구분)' })
    attachedFile: string;

    @CreateDateColumn({ comment: '생성일' })
    created_at: Date;

    @UpdateDateColumn({ comment: '수정일' })
    updated_at: Date;
}