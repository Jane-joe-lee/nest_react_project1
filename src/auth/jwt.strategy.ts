import {Injectable, UnauthorizedException} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./repository/user.repository";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./entity/user.entity";
import * as configYml from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        //@InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET || configYml.get('jwt.secret'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    //* 토큰이 유효하면 실행되는 함수
    async validate(payload) {
        const { username } = payload;
        const user: User = await this.userRepository.findOneBy( {username: username} );
        if ( !user ) {
            throw new UnauthorizedException();
        }
        return user;
    }

}