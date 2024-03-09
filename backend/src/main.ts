import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false
    })
  );

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false
    })
  );

  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: 'http://localhost:3000',
    credentials: true
  });

  app.setGlobalPrefix('api');

  await app.listen(3001);
}
bootstrap();
