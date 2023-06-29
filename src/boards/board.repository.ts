import { DataSource, Repository } from "typeorm"; // EntityRepository,
import { Board } from "./board.entity";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { BoardStatus, BoardType } from "./boards.default_type";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../auth/entity/user.entity";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import * as path from 'path';
import { existsSync, unlinkSync } from "fs";
import { SearchBoardDto } from "./dto/search-board.dto";

//@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {

    constructor(@InjectRepository(Board) private dataSource: DataSource) {
        super(Board, dataSource.manager)
        // super(Board, dataSource.createEntityManager())
    }

    async createBoard(createBoardDto: CreateBoardDto, user: User, folder: string, files: Array<Express.Multer.File>): Promise<boolean> {
        const { type, title, description, status, parentId } = createBoardDto;
        const boardData: Partial<Board> = { type, title, description, status, user, parentId };

        if ( files ) {
            const new_files = files.map(item => folder + '/' + item.filename);
            const filename = new_files.join('|');
            //const filename = `${folder}/${file.filename}`;
            boardData.attachedFile = filename;
        }
        let board = this.create(boardData);
        await this.save(board);
        return true;
    }

    // 게시물 조회용
    async getBoardById(id: number): Promise<Board> {

        const query = this.createQueryBuilder('board')
            .leftJoin('board.user', 'user')
            .select(['board', 'user.username'])
            .where('board.id = :id', { id })

        await query.update().set({ hitCnt: () => 'hitCnt + 1' }).execute(); // +1된 결과값을 받아오기 위해 await 추가

        const found = await query.getOne()

        if ( !found ) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }

        return found;
    }

    // 현재 repository에서 참조할 때 쓰는 게시판 정보만 리턴하는 용도
    async getOnlyBoardById(id: number): Promise<Board> {
        const found = await this.findOneBy({id: id} );
        if ( !found ) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        return found;
    }


    async updateBoardStatus(id: number, status: BoardStatus): Promise<boolean> {
        const board = await this.getOnlyBoardById(id);
        board.status =status;
        await this.save(board);
        return true;
    }

    async updateBoardLike(id: number, like: string): Promise<boolean> {
        const board = await this.getOnlyBoardById(id);
        if ( !like || like === '+' ) {
            board.likeCnt += 1;
        } else if ( like === '-'  && board.likeCnt > 0 ) {
            board.likeCnt -= 1;
        }
        await this.save(board);
        return true;
    }


    async updateBoard(id: number, updateBoardDto: UpdateBoardDto, user: User, folder: string, files: Array<Express.Multer.File>): Promise<boolean> {
        const board = await this.getOnlyBoardById(id);
        const { title, description, status, oldFileNames } = updateBoardDto;
        board.title = title;
        board.description = description;
        board.status = status;

        // 수정시 기존 파일은 파일명만 boards/a.png|boards/b.png 형태로 받아옴. 기존 파일과 비교해서 삭제된것만 파일삭제
        if ( oldFileNames ) {
            if ( oldFileNames !== board.attachedFile ) { // 기존 첨부파일이 달라진 경우

                const attachedFiles = board.attachedFile.split('|'); // 기존 파일
                const oldFiles = oldFileNames.split('|'); // 전달받은 파일명들. 여기서 없는 파일명은 기존 파일에서 삭제해줘야 함

                const missingFiles = attachedFiles.filter((file) => !oldFiles.includes(file));

                missingFiles.forEach((file) => {
                    this.deleteFiles(file);
                });
            }
        }

        let filename;
        // 새 파일 업로드
        if ( files ) {
            const new_files = files.map(item => folder + '/' + item.filename);
            filename = new_files.join('|');
        }

        if ( oldFileNames ) filename = `${oldFileNames}|${filename}`;
        board.attachedFile = filename;

        await this.save(board);
        return true;
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

    async getAllBoards(data: SearchBoardDto, type: BoardType): Promise<Board[]> {

        const types = type ?? BoardType.NOTICE; // 게시판 유형

        const query = this.createQueryBuilder('board');
        query.where('board.type = :type', { type: types })

        if ( data.searchType && data.searchWords ) {
            if (data.searchType == 'title') {
                query.andWhere('board.title LIKE :title', {title: `%${data.searchWords}%`})
            } else if (data.searchType == 'username') {
                query.leftJoin('board.user', 'user').andWhere('user.username = :username', {username: data.searchWords})
            }
        }

        // 페이지 설정
        const page = data.page ?? 0;
        const pageCnt = data.pageCnt ?? 0; // 한페이지당 보여줄 게시물수
        if ( page > 0 && pageCnt > 0 ) {
            const skip = (page - 1) * pageCnt; // 건너뛸 레코드 수
            if (skip > 0) {
                query.skip(skip);
            }
            query.take(pageCnt);
        }

        // username 추가
        let boards;
        if (data.searchType == 'username') {
            boards = await query.select(['board', 'user.username']).getMany();
        } else {
            boards = await query.leftJoinAndSelect('board.user', 'user').select(['board', 'user.username']).getMany();
        }

        return boards;

    }

    /*
    async getMyAllBoards(data: SearchBoardDto, user: User): Promise<Board[]> {
        const query = this.createQueryBuilder('board');
        query.where('board.userId = :userId', { userId: user.id })
        if ( data.searchType == 'title' ) {
            query.andWhere('board.title LIKE :title', { title: `%${data.searchWords}%` })
        }
        const boards = await query.getMany();
        return boards;
    }
    */

    async deleteBoard(id: number, user: User): Promise<boolean> {

        let result = false;
        try {
            const board = await this.getOnlyBoardById(id);

            if (board.userId === user.id) { // 작성자 본인만 삭제할 수 있음

                const delResult = await this.delete({ id: board.id });
                if (delResult.affected !== 0) {
                    result = true;

                    //* 파일이 있을 경우 삭제
                    if (board.attachedFile !== '') {
                        const tmpFiles = board.attachedFile.split('|');
                        for (const item of tmpFiles) {
                            this.deleteFiles(item);
                        }
                    }
                }

            } else {
                throw new NotFoundException(`작정자 본인만 삭제할 수 있습니다.`);
            }

        } catch (error) {
            if ( error.code === '23503' ) {
                throw new InternalServerErrorException(`댓글이 있어서 삭제할 수 없습니다.`)
            } else {
                throw error;
            }
        }

        return result;

    }

}