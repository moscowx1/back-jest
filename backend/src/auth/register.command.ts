import { Credential } from './credentials.dto';

export class RegisterCommand {
  constructor(public readonly credential: Credential) {}
}
