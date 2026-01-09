import { UserNameUpdatedV1EventPayload } from '../../types/user.js'
import { UserNameUpdated } from './UserNameUpdated.js'

export class UserNameUpdatedV1 extends UserNameUpdated {
  public previousName: string

  public name: string

  public version: number = 1

  constructor(payload: UserNameUpdatedV1EventPayload) {
    super(payload)

    this.previousName = payload.previousName
    this.name = payload.name
  }

  toJson() {
    return {
      previousName: this.previousName,
      name: this.name
    }
  }
}
