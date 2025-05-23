import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { UserCreated } from '../events/index.js'
import { UserMainRepository } from '../projections/user-main.repository.js'

/**
 * Event handler for handling user creation events.
 *
 * @class UserCreatedEventHandler
 * @implements {IEventHandler<UserCreatedV1>}
 */
@EventsHandler(UserCreated)
export class UserCreatedEventHandler implements IEventHandler<UserCreated> {
  constructor(private repository: UserMainRepository) {}

  /**
   * Handles the user created event.
   *
   * @param {UserCreatedV1} event - The user created event.
   */
  async handle(event: UserCreated) {
    await this.repository.save(event.toJson())
  }
}
