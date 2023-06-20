import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from "./board.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Board } from "./board.entity";
import { AuthModule } from "../auth/auth.module";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
      //TypeOrmModule.forFeature([BoardRepository])
    TypeOrmModule.forFeature([Board]),
    AuthModule,
    MulterModule.register({
      dest: './upload',
    })
  ],
  controllers: [BoardsController],
  providers: [BoardsService, BoardRepository]
})
export class BoardsModule {}
