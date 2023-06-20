import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class LoginLog extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: '로그인 시도한 username' })
    username: string;

    @Column({ comment: '상세메세지' })
    message: string;

    @Column({ default: true, comment: '로그인결과(성공-true, 실패-false)' })
    result: boolean;

    @Column( { comment: 'IP주소'})
    ip: string;

    @Column( { comment: 'user agent' })
    user_agent: string;

    @CreateDateColumn( { comment: '생성일' })
    created_at: Date;

}
