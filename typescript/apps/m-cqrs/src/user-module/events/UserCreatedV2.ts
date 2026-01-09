import { UserCreatedV1EventPayload } from '../../types/user.js'
import { UserCreated } from './UserCreated.js'

export class UserCreatedV2 extends UserCreated {
  public id: string

  public name: string

  public active: boolean

  public version: number = 2

  constructor(payload: UserCreatedV1EventPayload) {
    super(payload)

    this.id = payload.id
    this.name = payload.name
    this.active = payload.active
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      active: this.active
    }
  }
}
