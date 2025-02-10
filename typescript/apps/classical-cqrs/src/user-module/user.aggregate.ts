import { v4 } from 'uuid'
import { User } from '../types/user.js'
import { Aggregate } from '../aggregate-module/aggregate.js'
import { UserCreatedV1, UserNameUpdatedV1 } from './events/index.js'
import { CreateUserCommand, UpdateUserNameCommand } from './commands/index.js'

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
  create(user: CreateUserCommand) {
    this.id = v4()
    this.name = user.name

    this.version += 1

    const event = new UserCreatedV1({
      id: this.id,
      name: this.name,
      aggregateId: this.id,
      aggregateVersion: this.version
    })

    this.apply(event)

    return [event]
  }

  replayUserCreatedV1(event: UserCreatedV1) {
    this.id = event.id
    this.name = event.name

    this.version += 1
  }

  updateName(command: UpdateUserNameCommand) {
    this.version += 1

    const event = new UserNameUpdatedV1({
      previousName: this.name,
      name: command.name,
      aggregateId: this.id,
      aggregateVersion: this.version
    })

    this.name = command.name

    this.apply(event)

    return [event]
  }

  replayUserNameUpdatedV1(event: UserNameUpdatedV1) {
    this.name = event.name

    this.version += 1
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
