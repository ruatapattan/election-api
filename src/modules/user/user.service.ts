import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
const bcrypt = require('bcrypt');
import { Response } from 'express';
import handleErrorUtils from '../../ultilities/handleError.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, res: Response) {
    try {
      const hashed = await bcrypt.hash(createUserDto.password, 10);

      const userToSave = new User();
      userToSave.nationalId = createUserDto.nationalId;
      userToSave.password = hashed;

      await this.userRepository.save(userToSave);

      res.status(HttpStatus.CREATED).json({
        status: 'User created',
      });
    } catch (error) {
      console.log('err', error);
      await handleErrorUtils.handleError(error, res);
    }
  }

  async findOne(nationalId: string) {
    return await this.userRepository.createQueryBuilder('user')
      .select()
      .where(`user.national_id = '${nationalId}'`)
      .getOne()
  }

  async remove(id: string, res: Response) {
    try {
      const deleted = await this.userRepository.delete(id);

      if (deleted.affected > 0) {
        res.status(HttpStatus.OK).json({
          status: 'User deleted'
        })
      } else {
        throw {name: 'UnprocessableError', message: 'User not found'}
      }
    } catch (error) {
      console.log('err', error);
      await handleErrorUtils.handleError(error, res);
    }
  }
}
