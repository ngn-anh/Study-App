export const a='1';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,      // chỉ nhận field có trong DTO
      forbidNonWhitelisted: true,
      transform: true,      // tự convert kiểu dữ liệu
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Swagger
  setupSwagger(app);

  await app.listen(3000);
  console.log(`🚀 Server running on: http://localhost:3000`);
}
bootstrap();
