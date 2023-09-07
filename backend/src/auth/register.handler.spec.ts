import { JwtModule, JwtService } from '@nestjs/jwt';
import { PayloadService } from '../shared/payload.service';
import { RegisterCommandHandler } from './register.handler';
import { Test } from '@nestjs/testing';
import { RegisterDataAccess } from './register.data-access';
import { User } from '@prisma/client';
import { RegisterCommand } from './register.command';
jest.mock('./register.data-access');

describe('RegisterCommandHandler', () => {
  let registerHandler: RegisterCommandHandler;
  let jwtService: JwtService;
  let userId: bigint;

  beforeEach(async () => {
    userId = BigInt(1);

    const module = await Test.createTestingModule({
      providers: [
        RegisterCommandHandler,
        {
          provide: PayloadService,
          useValue: {
            getPayload: jest.fn().mockImplementation((v) => v),
          },
        },
        PayloadService,
        {
          provide: RegisterDataAccess,
          useValue: {
            createUser: jest
              .fn()
              .mockImplementation((login: string, password: string): User => {
                return {
                  id: userId,
                  created_at: new Date(),
                  login,
                  password,
                };
              }),
          },
        },
      ],
      imports: [JwtModule.register({ secretOrPrivateKey: 'Secret key' })],
    }).compile();

    registerHandler = await module.get(RegisterCommandHandler);
    jwtService = await module.get(JwtService);
  });

  describe('register tests', () => {
    it('should be defined', () => {
      expect(registerHandler).toBeDefined();
      expect(jwtService).toBeDefined();
    });

    it('should success register', async () => {
      const login = 'asdf';

      const res = await registerHandler
        .execute(new RegisterCommand({ login, password: 'asdf' }))
        .then((v) => {
          return jwtService.verifyAsync(v.access_token);
        });

      expect(res).toEqual(
        expect.objectContaining({
          login,
          sub: userId.toString(),
        }),
      );
    });
  });
});
