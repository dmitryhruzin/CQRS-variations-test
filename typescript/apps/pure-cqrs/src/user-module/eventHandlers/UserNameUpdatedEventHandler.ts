import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { UserNameUpdated } from '../events/index.js'
import { UserMainRepository } from '../projections/user-main.repository.js'

@EventsHandler(UserNameUpdated)
export class UserNameUpdatedEventHandler implements IEventHandler<UserNameUpdated> {
  constructor(private repository: UserMainRepository) {}

  async handle(event: UserNameUpdated) {
    await this.repository.update(event.aggregateId, {
      name: event.name,
      version: event.aggregateVersion
    })
  }
}
