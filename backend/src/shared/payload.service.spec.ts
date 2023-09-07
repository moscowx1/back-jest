import { Test } from '@nestjs/testing';
import { PayloadService } from './payload.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

describe('PayloadService', () => {
  let payloadService: PayloadService;
  let jwtService: DeepMocked<JwtService>;
  let user: User;

  beforeEach(async () => {
    user = {
      id: BigInt(1),
      created_at: new Date(),
      login: '',
      password: '',
    };

    const module = await Test.createTestingModule({
      providers: [PayloadService],
    })
      .useMocker(createMock)
      .compile();

    payloadService = module.get(PayloadService);
    jwtService = module.get(JwtService);
  });

  describe('getPayload', () => {
    it('should be defined', () => {
      expect(payloadService).toBeDefined();
    });

    it('should call jwt service', async () => {
      await payloadService.getPayload(user);

      expect(jwtService.signAsync).toBeCalled();
    });

    it('should return object with access_token prop', async () => {
      const res = await payloadService.getPayload(user);
      expect(res).toHaveProperty('access_token');
    });
  });
});
