import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as configYml from 'config';

const dbConfig = configYml.get('db');

export const typeORMConfig : TypeOrmModuleOptions = {
    type: process.env.DB_TYPE || dbConfig.type,
    host: process.env.DB_HOST || dbConfig.host,
    port: process.env.DB_PORT || dbConfig.port,
    username: process.env.DB_USERNAME || dbConfig.username,
    password: process.env.DB_PASSWORD || dbConfig.password,
    database: process.env.DB_NAME || dbConfig.database,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: process.env.DB_SYNCHRONIZE || dbConfig.synchronize
}