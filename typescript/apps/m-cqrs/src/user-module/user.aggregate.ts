import { v4 } from 'uuid'
import { AggregateUserData } from '../types/user.js'
import { Aggregate } from '../aggregate-module/aggregate.js'
import { UserCreatedV2, UserNameUpdatedV1, UserEnteredTheSystemV1 } from './events/index.js'
import { CreateUserCommand, UpdateUserNameCommand } from './commands/index.js'

/**
 * Represents the UserAggregate, managing user state and behavior.
 *
 * @class UserAggregate
 * @extends {Aggregate}
 */
export class UserAggregate extends Aggregate {
  private name: string

  private active: boolean = false

  constructor(data: AggregateUserData | null = null) {
    if (!data) {
      super()
    } else {
      super(data.id, data.version)

      this.name = data.name
      this.active = data.active
    }
  }

  /**
   * Creates a new user aggregate.  Applies the UserCreatedV1 event to initialize the user.
   *
   * @param {CreateUserCommand} user - The command containing the user data for creation.
   * @returns {Event[]} An array containing the UserCreatedV1 event that was applied.
   */
  create(command: CreateUserCommand) {
    this.id = v4()
    this.name = command.name

    this.version += 1

    const event = new UserCreatedV2({
      id: this.id,
      name: this.name,
      aggregateId: this.id,
      aggregateVersion: this.version,
      active: this.active
    })

    this.apply(event)

    return [event]
  }

  /**
   * Updates the name of the user. Applies the UserNameUpdatedV1 event.
   *
   * @param {UpdateUserNameCommand} command - The command containing the user ID and new name.
   * @returns {Event[]} An array containing the UserNameUpdatedV1 event that was applied.
   */
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

  enterTheSystem() {
    this.version += 1

    const event = new UserEnteredTheSystemV1({
      aggregateId: this.id,
      aggregateVersion: this.version
    })

    this.active = true

    this.apply(event)

    return [event]
  }

  /**
   * Converts the aggregate to a JSON representation.
   *
   * @returns {AggregateUserData} The user data in JSON format, including id, name, and version.
   * @throws {Error} If the aggregate is empty or not properly initialized.
   *
   * This method serializes the user aggregate into a JSON object suitable for storage or transmission.
   */
  toJson(): AggregateUserData {
    if (!this.id) {
      throw new Error('Aggregate is empty')
    }

    return {
      id: this.id,
      version: this.version,
      name: this.name,
      active: this.active
    }
  }
}
