import { UserNameUpdatedV1EventPayload } from '../../types/user.js'
import { UserNameUpdated } from './UserNameUpdated.js'

/**
 * Event representing the changing a name of a user.
 *
 * @class UserNameUpdatedV1
 * @implements {Event}
 */
export class UserNameUpdatedV1 extends UserNameUpdated {
  public previousName: string

  public name: string

  public version: number = 1

  /**
   * Creates an instance of UserCreatedV1.
   *
   * @param {User} payload - The user data.
   *
   * This constructor initializes the event with the user data.
   */
  constructor(payload: UserNameUpdatedV1EventPayload) {
    super(payload)

    this.previousName = payload.previousName
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
      previousName: this.previousName,
      name: this.name
    }
  }
}
