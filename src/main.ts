import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Default to Express adapter

  const config = new DocumentBuilder()
    .setTitle('Project Management API')
    .setDescription('API documentation for project management with sustainability integration')
    .setVersion('1.0')
    .addTag('users')
    .addTag('teamMembers')
    .addTag('projects')
    .addTag('sprints')
    .addTag('tasks')
    .addTag('backlogItems')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.enableCors();
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
