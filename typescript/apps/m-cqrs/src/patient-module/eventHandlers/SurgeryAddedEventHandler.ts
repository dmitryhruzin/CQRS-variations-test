import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { UserNameUpdatedV1 } from '../events/index.js'
import { UserMainRepository } from '../projections/patient-main.repository.js'

@EventsHandler(UserNameUpdatedV1)
export class UserNameUpdatedEventHandler implements IEventHandler<UserNameUpdatedV1> {
  constructor(private repository: UserMainRepository) {}

  async handle(event: UserNameUpdatedV1) {
    await this.repository.update(event.aggregateId, { name: event.name })
  }
}
