import { Injectable } from '@nestjs/common';
import { BoardStatus, BoardType } from "./boards.default_type";
import { CreateBoardDto } from "./dto/create-board.dto";
import { BoardRepository } from "./board.repository";
import { Board } from "./board.entity";
import { User } from "../auth/entity/user.entity";
import { SearchBoardDto } from "./dto/search-board.dto";
//import {InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class BoardsService {

    constructor(
        //@InjectRepository(BoardRepository)
        //@InjectRepository(Board)
        private boardRepository: BoardRepository
    ){}

    createBoard(createBoardDto: CreateBoardDto, user: User, folder: string, files: Array<Express.Multer.File>): Promise<boolean> {
        return this.boardRepository.createBoard(createBoardDto, user, folder, files);
    }

    getBoardById(id: number): Promise<Board> {
        const board = this.boardRepository.getBoardById(id);
        return board;
    }

    deleteBoard(id: number, user: User): Promise<boolean> {
        return this.boardRepository.deleteBoard(id, user);
    }

    updateBoardStatus(id: number, status: BoardStatus): Promise<boolean> {
        return this.boardRepository.updateBoardStatus(id, status);
    }

    updateBoardLike(id: number, like: string): Promise<boolean> {
        return this.boardRepository.updateBoardLike(id, like);
    }

    updateBoard(id: number, createBoardDto: CreateBoardDto, user: User, folder: string, files: Array<Express.Multer.File>): Promise<boolean> {
        return this.boardRepository.updateBoard(id, createBoardDto, user, folder, files);
    }

    getAllBoards(data: SearchBoardDto, type: BoardType): Promise<Board[]> {
        return this.boardRepository.getAllBoards(data, type);
    }

    /*
    getMyAllBoards(data: SearchBoardDto, user: User): Promise<Board[]> {
        return this.boardRepository.getMyAllBoards(data, user);
    }
    */

    /*//private boards: Board[] = [];

    getAllBoards(): Board[] {
        return this.boards;
    }

    createBoard(createBoardDto: CreateBoardDto) {
        const { title, description } = createBoardDto;
        const board: Board = {
            id: uuid(),
            title,
            description,
            status: BoardStatus.PUBLIC
        }
        this.boards.push(board);
        return board;
    }

    getBoardById(id: string): Board {
        const found = this.boards.find((board)=>board.id === id);
        if ( !found ) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        return found;
    }

    deleteBoard(id: string): void {
        const found = this.getBoardById(id);
        this.boards = this.boards.filter((board)=> board.id !== found.id);
    }

    updateBoardStatus(id: string, status: BoardStatus): Board {
        const board = this.getBoardById(id);
        board.status = status;
        return board;
    }
     */
}
