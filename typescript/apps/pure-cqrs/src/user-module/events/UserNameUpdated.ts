import EventBase from '../../types/EventBase.js'
import { UserNameUpdatedEventPayload } from '../../types/user.js'

export class UserNameUpdated extends EventBase {
  public previousName: string

  public name: string

  /**
   * Creates an instance of UserCreatedV1.
   *
   * @param {User} payload - The user data.
   *
   * This constructor initializes the event with the user data.
   */
  constructor(payload: UserNameUpdatedEventPayload) {
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
