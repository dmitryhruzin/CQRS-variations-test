import EventBase from '../../types/EventBase.js'
import { UserCreatedEventPayload } from '../../types/user.js'

export class UserCreated extends EventBase {
  public id: string

  public name: string

  constructor(payload: UserCreatedEventPayload) {
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
