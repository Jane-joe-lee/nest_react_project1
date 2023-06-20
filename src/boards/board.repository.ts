import { DataSource, Repository } from "typeorm"; // EntityRepository,
import { Board } from "./board.entity";
import { CreateBoardDto } from "./dto/create-board.dto";
import { BoardStatus } from "./board-status.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../auth/entity/user.entity";
import {InternalServerErrorException, NotFoundException} from "@nestjs/common";
import * as path from 'path';
import { existsSync, unlinkSync } from "fs";

//@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {

    constructor(@InjectRepository(Board) private dataSource: DataSource) {
        super(Board, dataSource.manager)
        // super(Board, dataSource.createEntityManager())
    }

    async createBoard(createBoardDto: CreateBoardDto, user: User, folder: string, files: Array<Express.Multer.File>): Promise<Board> {
        const {title, description, status, parentId} = createBoardDto;
        const boardData: Partial<Board> = {title, description, status, user, parentId};

        if ( files ) {
            const new_files = files.map(item => folder + '/' + item.filename);
            const filename = new_files.join('|');
            //const filename = `${folder}/${file.filename}`;
            boardData.attachedFile = filename;
        }
        const board = this.create(boardData);
        await this.save(board);
        return board;
    }

    async getBoardById(id: number, update: string): Promise<Board> {
        const found = await this.findOneBy({id: id});

        if ( !found ) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }

        if ( update == 'y' ) {
            found.hitCnt += 1;
            await this.save(found);
        }
        return found;
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id, 'n');
        board.status =status;
        await this.save(board);
        return board;
    }

    async updateBoardLike(id: number, like: string): Promise<Board> {
        const board = await this.getBoardById(id, 'n');
        if ( like === '+' ) {
            board.likeCnt += 1;
        } else if ( like === '-'  && board.likeCnt > 0 ) {
            board.likeCnt -= 1;
        }
        await this.save(board);
        return board;
    }


    async updateBoard(id: number, createBoardDto: CreateBoardDto, user: User, folder: string, files: Array<Express.Multer.File>): Promise<Board> {
        const board = await this.getBoardById(id, 'n');
        const {title, description, status} = createBoardDto;
        board.title = title;
        board.description = description;
        board.status = status;

        if ( files ) {
            const new_files = files.map(item => folder + '/' + item.filename);
            const filename = new_files.join('|');
            //const filename = `${folder}/${file.filename}`;
            board.attachedFile = filename;

            //* 파일이 있을 경우 삭제
            if ( board.attachedFile !== '' ) {
                const tmpFiles = board.attachedFile.split('|');
                for(const item of tmpFiles) {
                    this.deleteFiles(item);
                }
            }
        }

        await this.save(board);
        return board;
    }

    async deleteFiles(filename: string): Promise<void> {
        try {
            const filePath = path.join(__dirname, '../common', `uploads/${filename}`);
            if ( existsSync(filePath) ) {
                await unlinkSync(filePath);
            }
        } catch (error) {
            throw new NotFoundException('File Not Found');
        }
    }

    async getAllBoards(): Promise<Board[]> {
        return await this.find();
    }

    async getMyAllBoards(user: User): Promise<Board[]> {
        const query = this.createQueryBuilder('board');
        query.where('board.userId = :userId', { userId: user.id})
        const boards = await query.getMany();
        return boards;
    }

    async deleteBoard(id: number, user: User): Promise<void> {
        try {
            const result = await this.delete({
                id,
                user: {id: user.id}
            });
            if (result.affected === 0) {
                throw new NotFoundException(`Can't find Board with id ${id}`);
            }
        } catch (error) {
            if ( error.code === '23503' ) {
                throw new InternalServerErrorException(`댓글이 있어서 삭제할 수 없습니다.`)
            }
        }
    }

}