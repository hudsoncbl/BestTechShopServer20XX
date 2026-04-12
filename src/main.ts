import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ твої пайпи залишаємо
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ твій фільтр теж
  app.useGlobalFilters(new HttpExceptionFilter());

  // 🔥 ДОДАЄМО МІКРОСЕРВІС
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 4001,
    },
  });

  // 🔥 ЗАПУСК МІКРОСЕРВІСІВ
  await app.startAllMicroservices();

  // HTTP залишається
  await app.listen(3000);
}
bootstrap();
