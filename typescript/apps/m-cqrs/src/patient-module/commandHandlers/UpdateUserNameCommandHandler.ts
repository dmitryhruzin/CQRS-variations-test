import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs'
import { UpdateUserNameCommand } from '../commands/index.js'
import { UserRepository } from '../patient.repository.js'

/**
 * Command handler for updating a user's anme.
 *
 * @class UpdateUserNameCommand
 * @implements {ICommandHandler<UpdateUserNameCommand>}
 */
@CommandHandler(UpdateUserNameCommand)
export class UpdateUserNameCommandHandler implements ICommandHandler<UpdateUserNameCommand> {
  constructor(
    private repository: UserRepository,
    private publisher: EventPublisher
  ) {}

  /**
   * Executes the command to create a new user.
   *
   * @param {UpdateUserNameCommand} command - The update user's name command.
   * @returns {Promise<string>} Promise resolving to an acknowledgement string.
   */
  async execute(command: UpdateUserNameCommand): Promise<string> {
    const userAggregate = this.publisher.mergeObjectContext(await this.repository.buildUserAggregate(command.id))

    const events = userAggregate.updateName(command)
    await this.repository.save(userAggregate, events)

    userAggregate.commit()

    return 'Acknowledgement OK'
  }
}
