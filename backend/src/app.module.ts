import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './config/Config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate: (config) => configSchema.parse(config),
    }),
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        '..',
        'frontend',
        'dist',
        'frontend',
        //'index.html',
      ),
    }),
  ],
})
export class AppModule {}
