import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Credential } from './credentials.dto';
import { LoginCommand } from './login.command';
import { RegisterCommand } from './register.command';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  async login(@Body() credential: Credential) {
    return this.commandBus.execute(new LoginCommand(credential));
  }

  @Post()
  async register(@Body() credential: Credential) {
    return this.commandBus.execute(new RegisterCommand(credential));
  }

  @UseGuards(AuthGuard)
  @Get()
  async profile(@Request() req) {
    return req.user;
  }
}
