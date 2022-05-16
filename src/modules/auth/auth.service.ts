import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import handleErrorUtils from '../..//ultilities/handleError.utils';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
const bcrypt = require('bcrypt');
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService,) {}

  async login(loginDto: LoginDto, res: Response) {
    try {
      const userFound = await this.userService.findOne(loginDto.nationalId);
      if (userFound) {
        const correctPassword = await bcrypt.compare(
          loginDto.password,
          userFound.password,
        );
        if (!correctPassword) {
            throw {name: 'UnAuthorizedError', message: 'Incorrect username or password'}
        } else {
            const payload = {
                id: userFound.id,
                nationalId: userFound.nationalId
            }
            const token = this.jwtService.sign(payload)

            res.status(HttpStatus.OK).json({
                message: 'Login success',
                accessToken: token
            })
        }
      } else {
        throw {name: 'UnAuthorizedError', message: 'Incorrect username or password'}
      }
    } catch (error) {
        console.log('err', error);
        await handleErrorUtils.handleError(error, res);
    }
  }
}
