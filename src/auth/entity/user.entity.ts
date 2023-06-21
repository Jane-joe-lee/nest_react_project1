import {
    BaseEntity,
    Column, JoinColumn,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from "typeorm";
import { Board } from "../../boards/board.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'user1',
        description: '사용자ID',
        required: true
    })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Column({ comment: '사용자ID'})
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
    @Column({ comment: '비밀번호' })
    password: string;

    @ApiProperty({
        example: '1',
        description: '사용자 레벨(1(낮음)~10(관리자))'
    })
    @IsNumber()
    @Column({ default: 1, comment: '사용자 레벨(1(낮음)~10(관리자))' })
    level: number;

    //* eager:true => user 가져올 때 게시물도 같이 가져오도록
    @OneToMany(type => Board, board => board.user, {eager: false})
    boards: Board[]

    // 추가(board 리턴시 userId도 보이도록), inverse side로 userId와 관계 매핑
    @JoinColumn({ name: 'userId' })
    user: User;

    @ApiProperty({
        example: 'myprofile.png',
        description: '사용자 프로필 이미지'
    })
    @IsString()
    @Column({ nullable: true, comment: '사용자 프로필 이미지'})
    profile_img: string;

    @CreateDateColumn( { comment: '생성일' })
    created_at: Date;

    @UpdateDateColumn( { comment: '수정일' })
    updated_at: Date;

}
