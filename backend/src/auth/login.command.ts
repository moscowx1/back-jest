import { Credential } from './credentials.dto';

export class LoginCommand {
  constructor(public readonly credential: Credential) {}
}
