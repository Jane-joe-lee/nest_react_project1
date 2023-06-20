import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from "express-basic-auth";
import { HttpExceptionFilter } from "./common/exceptions/http-exception.filter";
import { SuccessInterceptor } from "./common/interceptors/success.interceptor";
import * as configYml from 'config';
import { ValidationPipe } from "@nestjs/common";
import * as path from 'path';
import { NestExpressApplication } from "@nestjs/platform-express";
//import cookieParser from "cookie-parser";

// security
import helmet from 'helmet'; // HTTP header 설정하는 미들웨어 함수 모음

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    //app.use(cookieParser());

  const serverConfig = configYml.get('server');

  app.use(helmet());

  const config = new DocumentBuilder()
      .setTitle('Swagger Example')
      .setDescription('Swagger API description')
      .setVersion('1.0.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /*
  app.use(
      ['/api'],
      expressBasicAuth({
        challenge: true,
        users: {
            [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD
        }
      }),
  );*/

  // http://localhost:5001/media/boards/aaa.png로 접근 가능하도록 ( 상단 app 부분에 create<NestExpressApplication>도 추가 )
  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
     prefix: '/media'
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor());

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  });

  //await app.listen(process.env.PORT);
  await app.listen(serverConfig.port);
}
bootstrap();
