import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'typeorm';
import * as dotenv from 'dotenv'

import { CandidatesModule } from './modules/candidates/candidates.module'
import { VotesModule } from './modules/votes/votes.module';
import { ElectionModule } from './modules/election/election.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
const SnakeNamingStrategy = require("typeorm-naming-strategies").SnakeNamingStrategy

dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.HOST_NAME,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: process.env.DB_SYNC === 'true' ? true : false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    CandidatesModule,
    VotesModule,
    ElectionModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
