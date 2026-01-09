import { ExitTheSystemRequest } from '../../types/user.js'

export class UserExitTheSystemCommand {
  public readonly id: string

  public readonly name: string

  constructor(public readonly payload: ExitTheSystemRequest) {
    this.id = payload.id
  }
}
