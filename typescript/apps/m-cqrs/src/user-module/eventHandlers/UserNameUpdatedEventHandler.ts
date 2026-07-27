import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InjectLogger, Logger } from '@CQRS-variations-test/logger'
import { UserNameUpdatedV1 } from '../events/index.js'
import { UserMainRepository } from '../projections/user-main.repository.js'

@EventsHandler(UserNameUpdatedV1)
export class UserNameUpdatedEventHandler implements IEventHandler<UserNameUpdatedV1> {
  constructor(
    private repository: UserMainRepository,
    @InjectLogger(UserNameUpdatedEventHandler.name) private readonly logger: Logger
  ) {}

  async handle(event: UserNameUpdatedV1) {
    await this.repository.update(event.aggregateId, {
      name: event.name,
      version: event.aggregateVersion
    })
    this.logger.info(`{"id":"${event.aggregateId}","endTime":${Date.now()}}`)
  }
}
