import { UserCreatedV1EventPayload } from '../../types/user.js'
import { UserCreated } from './UserCreated.js'

export class UserCreatedV1 extends UserCreated {
  public id: string

  public name: string

  public version: number = 1

  constructor(payload: UserCreatedV1EventPayload) {
    super(payload)

    this.id = payload.id
    this.name = payload.name
  }

  toJson() {
    return {
      id: this.id,
      name: this.name
    }
  }
}
