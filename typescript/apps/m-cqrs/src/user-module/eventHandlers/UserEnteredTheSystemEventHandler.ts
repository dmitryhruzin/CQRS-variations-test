import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { UserEnteredTheSystemV1 } from '../events/index.js'
import { UserMainRepository } from '../projections/user-main.repository.js'

@EventsHandler(UserEnteredTheSystemV1)
export class UserEnteredTheSystemEventHandler implements IEventHandler<UserEnteredTheSystemV1> {
  constructor(private repository: UserMainRepository) {}

  async handle(event: UserEnteredTheSystemV1) {
    await this.repository.update(event.aggregateId, {
      active: event.active,
      version: event.aggregateVersion
    })
  }
}
