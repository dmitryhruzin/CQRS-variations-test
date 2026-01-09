import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs'
import { UserExitTheSystemCommand } from '../commands/index.js'
import { UserRepository } from '../user.repository.js'

@CommandHandler(UserExitTheSystemCommand)
export class UserExitTheSystemCommandHandler implements ICommandHandler<UserExitTheSystemCommand> {
  constructor(
    private repository: UserRepository,
    private publisher: EventPublisher
  ) {}

  async execute(command: UserExitTheSystemCommand): Promise<string> {
    const userAggregate = this.publisher.mergeObjectContext(await this.repository.buildUserAggregate(command.id))

    const events = userAggregate.exitTheSystem()
    await this.repository.save(userAggregate, events)

    userAggregate.commit()

    return 'Acknowledgement OK'
  }
}
