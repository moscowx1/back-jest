import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './config/Config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<Config>);

  const swaggerConf = new DocumentBuilder()
    .setTitle('Cats api ')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConf);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.getOrThrow('port'));
}
bootstrap();
