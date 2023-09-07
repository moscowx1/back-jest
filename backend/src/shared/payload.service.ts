import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class PayloadService {
  constructor(private readonly jwtService: JwtService) {}

  async getPayload(user: User) {
    const payload = { sub: user.id.toString(), login: user.login };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
