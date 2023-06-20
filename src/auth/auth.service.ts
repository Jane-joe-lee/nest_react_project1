import {Injectable, UnauthorizedException} from '@nestjs/common';
import { UserRepository } from "./repository/user.repository";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { LoginlogRepository } from "./repository/loginlog.repository";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private loginLogRepository: LoginlogRepository
    ) {}

    async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.userRepository.createUser(authCredentialDto);
    }

    loginLog(username: string, result: boolean, req: Request): Promise<void> {
        this.loginLogRepository.loginLog(username, result, req);
        return null;
    }

    async signIn(authCredentailDto: AuthCredentialDto, req: Request): Promise<{accessToken: string}> {
        const { username, password } = authCredentailDto;
        //const user = await this.userRepository.findOneBy({ username: username });
        const user = await this.userRepository.getUserByName(authCredentailDto);
        if ( user && (await bcrypt.compare(password, user.password)) ) {
            // 유저 토큰 생성 ( secret + payload )
            const payload = { username }; // payload에는 중요정보는 넣지 말기
            const accessToken = await this.jwtService.sign(payload);

            // log
            this.loginLog(username, true, req);

            return { accessToken };
        } else {

            this.loginLog(username, false, req);
            throw new UnauthorizedException('logIn failed');
        }
    }

    profileImg(user: User, folder: string, file: Express.Multer.File): Promise<String> {
        const filename = `${folder}/${file.filename}`;
        const result = this.userRepository.updateProfile(user, folder, file);
        return result;
    }

    profileImgDelete(user: User): Promise<void> {
        return this.userRepository.deleteProfile2(user);
    }

    getAllUsers(user: User): Promise<User[]> {
        return this.userRepository.getAllUsers(user);
    }

    getOneUser(user: User, id: number): Promise<User> {
        return this.userRepository.getOneUser(user, id);
    }

    getLoginUser(user: User): Promise<User> {
        return this.userRepository.getLoginUser(user);
    }

    setPassword(user: User, body: any): Promise<boolean> {
        return this.userRepository.setPassword(user, body);
    }
}
