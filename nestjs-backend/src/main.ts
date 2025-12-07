export const a='2';
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

  // Swagger
  setupSwagger(app);

  await app.listen(3000);
  console.log(`🚀 Server running on: http://localhost:3000`);
}
bootstrap();
