import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { LoginCommandHandler } from './login.handler';
import { RegisterCommandHandler } from './register.handler';
import { PayloadService } from '../shared/payload.service';
import { PrismaService } from '../shared/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/Config';
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [
    CqrsModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async (config: ConfigService<Config>) => ({
        secret: config.getOrThrow('jwtSecret'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginCommandHandler,
    RegisterCommandHandler,
    PrismaService,
    PayloadService,
    AuthGuard,
  ],
})
export class AuthModule {}
