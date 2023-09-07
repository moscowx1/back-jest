import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import * as bcrypt from 'bcrypt';
import { LoginDataAccess } from './login.data-access';
import { JwtAuth } from './jwt-auth.dto';
import { PayloadService } from '../shared/payload.service';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly dataAccess: LoginDataAccess,
    private readonly payloadService: PayloadService,
  ) {}

  async execute(command: LoginCommand): Promise<JwtAuth> {
    const { login, password } = command.credential;
    const user = await this.dataAccess.findUserByLogin(login);
    if (!user)
      //TODO:
      throw new Error('');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('');

    return this.payloadService.getPayload(user);
  }
}
