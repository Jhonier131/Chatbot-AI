import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so the frontend can securely connect to this API
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable global validation for DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Swagger UI configuration
  const config = new DocumentBuilder()
    .setTitle('Wizybot API')
    .setDescription('The Wizybot Chat API description')
    .setVersion('1.0')
    .addTag('chat')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
