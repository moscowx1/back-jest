import { Test } from '@nestjs/testing';
import { LoginCommandHandler } from './login.handler';
import { LoginDataAccess } from './login.data-access';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoginCommand } from './login.command';
import { PayloadService } from '../shared/payload.service';

describe('LoginCommandHandler', () => {
  let correctPassword: string;
  let correctLogin: string;
  let correctId: bigint;
  let user: User;

  let loginHandler: LoginCommandHandler;
  let jwtService: JwtService;

  beforeEach(async () => {
    correctPassword = 'superExtraPassword';
    correctLogin = 'dancer';
    correctId = BigInt(1);
    user = {
      id: correctId as any,
      created_at: new Date(),
      login: correctLogin,
      password: bcrypt.hashSync(correctPassword, 10),
    };

    const module = await Test.createTestingModule({
      providers: [
        LoginCommandHandler,
        PayloadService,
        {
          provide: LoginDataAccess,
          useValue: {
            findUserByLogin: jest.fn().mockImplementation((l) => {
              if (l === correctLogin) return user;
              return null;
            }),
          },
        },
      ],
      imports: [JwtModule.register({ secretOrPrivateKey: 'Secret key' })],
    }).compile();

    loginHandler = await module.get(LoginCommandHandler);
    jwtService = await module.get(JwtService);
  });

  describe('login tests', () => {
    it('should be defined', () => {
      expect(loginHandler).toBeDefined();
      expect(jwtService).toBeDefined();
    });

    it('success login', async () => {
      const res = await loginHandler
        .execute(
          new LoginCommand({ login: correctLogin, password: correctPassword }),
        )
        .then((v) => jwtService.verifyAsync(v.access_token));

      expect(res).toEqual(
        expect.objectContaining({
          sub: correctId.toString(),
          login: correctLogin,
        }),
      );
    });

    it('error on bad login', async () => {
      const res = loginHandler
        .execute(
          new LoginCommand({
            login: 'zx/.cbm,nzc/xvb',
            password: correctPassword,
          }),
        )
        .then((v) => jwtService.verifyAsync(v.access_token));

      expect(res).rejects.toThrow();
    });

    it('error on bad password', async () => {
      const res = loginHandler
        .execute(
          new LoginCommand({
            login: correctLogin,
            password: 'narrowSwitching',
          }),
        )
        .then((v) => jwtService.verifyAsync(v.access_token));

      expect(res).rejects.toThrow();
    });
  });
});
