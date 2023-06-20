import { DataSource, Repository } from "typeorm"; // EntityRepository
import { User } from "../entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialDto } from "../dto/auth-credential.dto";
import { ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import { unlinkSync, existsSync } from 'fs';
import * as path from 'path';
import { CreateBoardDto } from "../../boards/dto/create-board.dto";

//*import fs from "fs";
//import * as fs from 'fs';

//@EntityRepository(User)
export class UserRepository extends Repository<User> {
    constructor(
        @InjectRepository(User) private dataSource: DataSource,
    ) {
        super(User, dataSource.manager);
    }


    async createUser(authCredentailDto: AuthCredentialDto): Promise<void>{
        const { username, password } = authCredentailDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.create({username, password: hashedPassword});
        try {
            await this.save(user);
        } catch (error) {
            if ( error.code === '23505' ) {
                throw new ConflictException('Existing username');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async getUserByName(authCredentailDto: AuthCredentialDto): Promise<User> {
        const { username, password } = authCredentailDto;
        const user = await this.findOneBy({ username: username });
        return user;
    }

    async updateProfile(user: User, folder: string, file: Express.Multer.File): Promise<String> {
        const filename = `${folder}/${file.filename}`;
        this.deleteProfile(user); // 삭제
        user.profile_img = filename;
        await this.save(user);
        return filename;
    }

    async deleteProfile(user: User): Promise<void> {
        if ( user.profile_img ) {
            const filename = `${user.profile_img}`;
            try {
                const filePath = path.join(__dirname, '../../common', `uploads/${filename}`);
                if (existsSync(filePath)) {
                    user.profile_img = '';
                    await unlinkSync(filePath);
                }
            } catch (error) {
                throw new NotFoundException('File Not Found');
            }
        }
    }

    async deleteProfile2(user: User): Promise<void> {
        this.deleteProfile(user); // 삭제
        user.profile_img = '';
        await this.save(user);
    }

    async getAllUsers(user: User): Promise<User[]> {
        if ( user.level == 10 ) {
            const users = await this.find({ select: ['id', 'username', 'level']});
            //users.forEach(user => { delete user.password; });
            return users;
        } else {
            throw new UnauthorizedException('인증되지 않은 사용자입니다')
        }
    }

    async getOneUser(user: User, id: number): Promise<User> {
        if ( user.level == 10 ) {
            let found = await this.findOneBy({id: id});
            if ( !found ) {
                throw new NotFoundException(`Can't find User with id ${id}`);
            }
            delete found.password;
            return found;
        } else {
            throw new UnauthorizedException('인증되지 않은 사용자입니다')
        }
    }

    async getLoginUser(user: User): Promise<User> {
        if ( user ) {
            let found = user;
            delete found.password;
            return found;
        } else {
            throw new UnauthorizedException('인증되지 않은 사용자입니다')
        }
    }

    async setPassword(user: User, body: any): Promise<boolean> {
        if ( user ) {
            const { nowPassword, password } = body;
            const isMatch = await bcrypt.compare(nowPassword, user.password);
            if ( !isMatch ) {
                throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
            }

            // 새 비밀번호 생성
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            // 새 비밀번호 저장
            user.password = hashedPassword;
            await this.save(user);
            return true;
        } else {
            throw new UnauthorizedException('인증되지 않은 사용자입니다')
        }
    }

}

