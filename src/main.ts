import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //enabled just in case
  app.useGlobalPipes(new ValidationPipe()); // enable ValidationPipe`
  app.setGlobalPrefix('api')
  await app.listen(process.env.PORT);
  console.log(`server is running on port ${process.env.PORT}`)
}
bootstrap();
