import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { UserCreatedV1 } from '../events/index.js'
import { UserMainRepository } from '../projections/user-main.repository.js'

/**
 * Event handler for handling user creation events.
 *
 * @class UserCreatedEventHandler
 * @implements {IEventHandler<UserCreatedV1>}
 */
@EventsHandler(UserCreatedV1)
export class UserCreatedEventHandler implements IEventHandler<UserCreatedV1> {
  constructor(private repository: UserMainRepository) {}

  /**
   * Handles the user created event.
   *
   * @param {UserCreatedV1} event - The user created event.
   */
  async handle(event: UserCreatedV1) {
    await this.repository.save(event.toJson())
  }
}
