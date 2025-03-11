import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs'
import { AddSurgeryCommand } from '../commands/index.js'
import { PatientRepository } from '../patient.repository.js'

@CommandHandler(AddSurgeryCommand)
export class AddSurgeryCommandHandler implements ICommandHandler<AddSurgeryCommand> {
  constructor(
    private repository: PatientRepository,
    private publisher: EventPublisher
  ) {}

  async execute(command: AddSurgeryCommand): Promise<string> {
    const aggregate = this.publisher.mergeObjectContext(await this.repository.buildAggregate(command.patientId))

    const events = aggregate.addSurgery(command)
    await this.repository.save(aggregate, events)

    aggregate.commit()

    return 'Acknowledgement OK'
  }
}
