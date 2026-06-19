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
    .setDescription(
      `## 🤖 Wizybot — AI-Powered Product Assistant\n\n` +
      `Wizybot is an intelligent chatbot API that helps users discover products and compare prices in real time.\n\n` +
      `### Features\n` +
      `- **Product Search** — Searches a live product catalog using natural language queries.\n` +
      `- **Currency Conversion** — Converts prices between any currencies using live exchange rates (Open Exchange Rates).\n` +
      `- **Multi-tool Orchestration** — Uses OpenAI Function Calling to chain multiple tools in a single conversation turn.\n` +
      `- **Smart Fallback** — Automatically retries with related keywords if the initial search returns no results.\n\n` +
      `### How to use\n` +
      `Send a \`POST /chat\` request with a natural language \`prompt\` and Wizybot will respond with product recommendations, images, and converted prices.\n\n` +
      `> **Note:** Requires a valid \`OPENAI_API_KEY\` and \`OPEN_EXCHANGE_APP_ID\` in the environment variables.`,
    )
    .setVersion('1.0')
    .setContact('Wizybot Team', '', 'support@wizybot.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('chat', 'Endpoints for AI-powered chat and product recommendations')
    .addTag('health', 'API health and status check')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
