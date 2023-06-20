import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from "./repository/user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import * as configYml from 'config';
import { LoginLog } from "./entity/login.entity";
import {LoginlogRepository} from "./repository/loginlog.repository";

const jwtConfig = configYml.get('jwt');
@Module({
  imports: [
      //TypeOrmModule.forFeature([UserRepository])
      TypeOrmModule.forFeature([User, LoginLog]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
          secret: jwtConfig.secret,
          signOptions: {
              expiresIn: jwtConfig.expiresIn,
          }
      }),
  ],
  controllers: [AuthController],

  // auth module에서 사용 가능하도록
  providers: [AuthService, UserRepository, JwtStrategy, LoginlogRepository],

  // 다른 모듈에서 사용 가능하도록
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
