import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

interface commonResponseError {
  statusCode? :number;
  message : string;
  error? : string;
  status?: string;
}

class HandleError {
  async handleError(error, res: Response) {
    if (error  && error.response) {
     const status = error.response.statusCode || error.status
      return res.status(status).json(error.response);
    }


    if (error.name === 'UnAuthorizedError' ) {
      console.log(error.name)
      const resError: commonResponseError = {
        status: 'error',
        message: error.message,
      };
      return res.status(HttpStatus.UNAUTHORIZED).json(resError);
    }
    if (error.name === 'ConflictError' ) {
      console.log(error.name)
      const resError: commonResponseError = {
        status: 'error',
        message: error.message,
      };
      return res.status(HttpStatus.CONFLICT).json(resError);
    }
    if (error.name === 'UnprocessableError' ) {
      console.log(error.name)
      const resError: commonResponseError = {
        status: 'error',
        message: error.message,
      };
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(resError);
    }
    if (error.name === 'BadRequestError' ) {
      console.log(error.name)
      const resError: commonResponseError = {
        // statusCode: HttpStatus.BAD_REQUEST,
        status: 'error',
        message: error.message,
        // error: 'BAD_REQUEST',
      };
      return res.status(HttpStatus.BAD_REQUEST).json(resError);
    }
    if (error.name === 'QueryFailedError') {
      console.log(typeof error.errno);
      // duplicate entry key
      if (error.errno === 1062) {
        const resError: commonResponseError = {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: error.sqlMessage,
          error: ' UNPROCESSABLE',
        };
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(resError);
      } else if (error.errno === 1452) {
        //cannot find item
        const resError: commonResponseError = {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: error.message,
          error: 'Unprocessable',
        };
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(resError);
      }
    } else {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error: 'unhandle error',
      });
    }
  }
}

export default new HandleError();
