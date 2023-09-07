import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class LoginDataAccess {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByLogin(login: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { login } });
  }
}
