import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return validateRequest(req);
  }
}

const validateRequest = async (req: any) => {
  let bearerToken: string = await getBearerToken(req.headers);
  try {
    jwt.verify(bearerToken, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    throw new UnauthorizedException();
  }
};

const getBearerToken = async (data: any) => {
  let auth: string = '';
  if (!!data['authorization']) auth = data['authorization'].split(' ')[1];
  return auth;
};
