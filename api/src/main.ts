import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Encurtador de URL API')
    .setDescription('API REST para encurtamento de URLs com autenticação de usuários e gestão completa de links, incluindo redirecionamento, contagem de cliques e operações de edição e exclusão.')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: '/openapi.json'
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`API on http://localhost:${port}  |  Docs: http://localhost:${port}/docs`);
}
bootstrap();
