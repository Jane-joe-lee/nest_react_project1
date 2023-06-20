import { DataSource, Repository } from "typeorm"; // EntityRepository
import { LoginLog } from "../entity/login.entity";
import { InjectRepository } from "@nestjs/typeorm";
import {ConflictException, InternalServerErrorException} from "@nestjs/common";
import {agent} from "supertest";

//@EntityRepository(LoginLog)
export class LoginlogRepository extends Repository<LoginLog> {
    constructor(
        @InjectRepository(LoginLog) private dataSource: DataSource
    ) {
        super(LoginLog, dataSource.manager);
    }

    async loginLog(username: string, result: boolean, req: Request): Promise<void> {
        try {
            const ip = ''; // req.ip
            const user_agent = req.headers['user-agent'];
            const message = result === true ? 'success' : 'failed';
            const loginData = {
                username, message, result, ip, user_agent
            }
            const loginLog = this.create(loginData);
            await this.save(loginLog);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }


}