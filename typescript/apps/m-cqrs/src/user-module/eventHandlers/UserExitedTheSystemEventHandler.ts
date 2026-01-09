import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { UserExitedTheSystemV1 } from '../events/index.js'
import { UserMainRepository } from '../projections/user-main.repository.js'

@EventsHandler(UserExitedTheSystemV1)
export class UserExitedTheSystemEventHandler implements IEventHandler<UserExitedTheSystemV1> {
  constructor(private repository: UserMainRepository) {}

  async handle(event: UserExitedTheSystemV1) {
    await this.repository.update(event.aggregateId, {
      active: event.active,
      version: event.aggregateVersion
    })
  }
}
