import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class RegisterDataAccess {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(login: string, password: string): Promise<User> {
    return this.prismaService.$transaction(() =>
      this.prismaService.user.create({
        data: {
          login,
          password,
          created_at: new Date(),
        },
      }),
    );
  }
}
