import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import { WebsocketAdapter } from './gateway/gateway.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') ?? 3000;
  const websocketAdapter = new WebsocketAdapter(app);

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

  app.use(passport.initialize());
  app.useWebSocketAdapter(websocketAdapter);

  await app.listen(PORT, () => {
    console.log(`Pepe Chat API started on: ${PORT}`);
  });
}

bootstrap();
