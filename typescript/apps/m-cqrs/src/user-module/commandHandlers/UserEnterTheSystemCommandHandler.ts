import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs'
import { UserEnterTheSystemCommand } from '../commands/index.js'
import { UserRepository } from '../user.repository.js'

@CommandHandler(UserEnterTheSystemCommand)
export class UserEnterTheSystemCommandHandler implements ICommandHandler<UserEnterTheSystemCommand> {
  constructor(
    private repository: UserRepository,
    private publisher: EventPublisher
  ) {}

  async execute(command: UserEnterTheSystemCommand): Promise<string> {
    const userAggregate = this.publisher.mergeObjectContext(await this.repository.buildUserAggregate(command.id))

    const events = userAggregate.enterTheSystem()
    await this.repository.save(userAggregate, events)

    userAggregate.commit()

    return 'Acknowledgement OK'
  }
}
