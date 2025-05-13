import { v4 } from 'uuid'
import { AggregateUserData } from '../types/user.js'
import { Aggregate } from '../aggregate-module/aggregate.js'
import { UserCreated, UserNameUpdated } from './events/index.js'
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
  create(command: CreateUserCommand) {
    this.id = v4()

    const event = new UserCreated({
      id: this.id,
      name: command.name,
      aggregateId: this.id,
      aggregateVersion: this.version + 1
    })

    this.apply(event)

    return [event]
  }

  replayUserCreated(event: UserCreated) {
    this.id = event.id
    this.name = event.name

    this.version += 1
  }

  updateName(command: UpdateUserNameCommand) {
    const event = new UserNameUpdated({
      previousName: this.name,
      name: command.name,
      aggregateId: this.id,
      aggregateVersion: this.version + 1
    })

    this.apply(event)

    return [event]
  }

  replayUserNameUpdated(event: UserNameUpdated) {
    this.name = event.name

    this.version += 1
  }

  toJson(): AggregateUserData {
    if (!this.id) {
      throw new Error('Aggregate is empty')
    }

    return {
      id: this.id,
      version: this.version,
      name: this.name
    }
  }
}
