import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import * as bcrypt from 'bcrypt';
import { RegisterDataAccess } from './register.data-access';
import { JwtAuth } from './jwt-auth.dto';
import { PayloadService } from '../shared/payload.service';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    private readonly dataAccess: RegisterDataAccess,
    private readonly payloadService: PayloadService,
  ) {}

  async execute(command: RegisterCommand): Promise<JwtAuth> {
    const { login, password } = command.credential;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.dataAccess.createUser(login, hashedPassword);
    return this.payloadService.getPayload(user);
  }
}
