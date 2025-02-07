import { v4 } from 'uuid'
import { User, UserWithOptionalId } from '../types/user.js'
import { Aggregate } from '../aggregate-module/aggregate.js'
import { UserCreatedV1 } from './events/index.js'

/**
 * Aggregate root for managing user state and events.
 *
 * @class UserAggregate
 * @extends {AggregateRoot}
 */
export class UserAggregate extends Aggregate {
  private name: string

  /**
   * Creates a new user aggregate.
   *
   * @param {UserWithOptionalId} user - The user data.
   * @returns {UserCreatedV1[]} Array of events applied.
   *
   * This method initializes a new user aggregate and applies the UserCreatedV1 event.
   */
  create(user: UserWithOptionalId) {
    this.id = user.id ?? v4()
    this.name = user.name

    const event = new UserCreatedV1({
      id: this.id,
      name: this.name
    })
    this.apply(event)

    this.version += 1

    return [event]
  }

  /**
   * Converts the aggregate to a JSON representation.
   *
   * @returns {User} The user data in JSON format.
   * @throws {Error} If the aggregate is empty.
   *
   * This method serializes the user aggregate into a JSON object.
   */
  toJson(): User {
    if (!this.id) {
      throw new Error('Aggregate is empty')
    }

    return {
      id: this.id,
      name: this.name
    }
  }
}
