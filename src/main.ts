import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });
  app.useGlobalPipes(new ValidationPipe());

  
  const config = new DocumentBuilder()
    .setTitle('XO example')
    .setDescription('XO application documentation')
    .setVersion('1.0')
    .addTag('Tickets')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,POST,PUT,DELETE,PATCH', 
    credentials: false, 
    allowedHeaders: 'Content-Type, Authorization', 
  });

  app.use(bodyParser.json({ limit: '100mb' })); //Mb permitidos para archivos
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  await app.listen(3000);
}
bootstrap();
