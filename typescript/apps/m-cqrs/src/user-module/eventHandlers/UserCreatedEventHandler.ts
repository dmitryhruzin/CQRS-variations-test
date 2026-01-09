import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { UserCreatedV2 } from '../events/index.js'
import { UserMainRepository } from '../projections/user-main.repository.js'

@EventsHandler(UserCreatedV2)
export class UserCreatedEventHandler implements IEventHandler<UserCreatedV2> {
  constructor(private repository: UserMainRepository) {}

  async handle(event: UserCreatedV2) {
    await this.repository.save(event.toJson())
  }
}
