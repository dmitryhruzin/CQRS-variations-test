import { UpdateUserNameRequest } from '../../types/user.js'

/**
 * Command for creating a new user.
 *
 * @class UpdateUserNameCommand
 * @param {UpdateUserNameRequest} payload - The payload that contains new user's name.
 */
export class UpdateUserNameCommand {
  public readonly id: string

  public readonly name: string

  constructor(public readonly payload: UpdateUserNameRequest) {
    this.id = payload.id
    this.name = payload.name
  }
}
