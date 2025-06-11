import { EnterTheSystemRequest } from '../../types/user.js'

export class UserEnterTheSystemCommand {
  public readonly id: string

  public readonly name: string

  constructor(public readonly payload: EnterTheSystemRequest) {
    this.id = payload.id
  }
}
