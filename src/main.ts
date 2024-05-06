import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3001',
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') ?? 3000;

  await app.listen(PORT, () => {
    console.log(`Pepe Chat API started on: ${PORT}`);
  });
}
bootstrap();
