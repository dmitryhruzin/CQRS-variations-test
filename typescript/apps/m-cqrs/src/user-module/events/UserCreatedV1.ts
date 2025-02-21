import { UserCreatedV1EventPayload } from '../../types/user.js'
import { UserCreated } from './UserCreated.js'

/**
 * Event representing the creation of a user.
 *
 * @class UserCreatedV1
 * @implements {Event}
 */
export class UserCreatedV1 extends UserCreated {
  public id: string

  public name: string

  public version: number = 1

  constructor(payload: UserCreatedV1EventPayload) {
    super(payload)

    this.id = payload.id
    this.name = payload.name
  }

  /**
   * Converts the event to a JSON representation.
   *
   * @returns {{ id: string, name: string }} The event data in JSON format.
   *
   * This method serializes the event into a JSON object.
   */
  toJson() {
    return {
      id: this.id,
      name: this.name
    }
  }
}
