import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, QueryRunner } from 'typeorm';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService

  const mockUserService = {}

  class mockConnection {
    createQueryRunner(): QueryRunner {
      const qr = {
        manager: {
          
        },
      } as QueryRunner;
      qr.manager;
      Object.assign(qr.manager, {
        save: jest.fn().mockReturnValue({})
      });
      qr.connect = jest.fn();
      qr.release = jest.fn();
      qr.startTransaction = jest.fn();
      qr.commitTransaction = jest.fn();
      qr.rollbackTransaction = jest.fn();
      qr.release = jest.fn();
      return qr;
    }
}  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: Connection,
          useClass: mockConnection
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
