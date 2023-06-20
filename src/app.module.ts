import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { typeORMConfig } from "./configs/typeorm.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from "./common/logger/logger.middleware";

import { ThrottlerModule } from "@nestjs/throttler"; // 속도 제한 security

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      BoardsModule,
      TypeOrmModule.forRoot(typeORMConfig),
      AuthModule,
      ThrottlerModule.forRoot({
          ttl: 30, limit: 10
      })
  ],
  controllers: [AppController],
  providers: [
      AppService,
  ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
