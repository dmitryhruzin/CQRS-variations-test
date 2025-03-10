import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs'
import { OnboardPatientCommand } from '../commands/index.js'
import { PatientRepository } from '../patient.repository.js'

@CommandHandler(OnboardPatientCommand)
export class OnboardPatientCommandHandler implements ICommandHandler<OnboardPatientCommand> {
  constructor(
    private repository: PatientRepository,
    private publisher: EventPublisher
  ) {}

  async execute(command: OnboardPatientCommand): Promise<string> {
    const aggregate = this.publisher.mergeObjectContext(await this.repository.buildAggregate())

    const events = aggregate.onboardPatient(command)
    await this.repository.save(aggregate, events)

    aggregate.commit()

    return 'Acknowledgement OK'
  }
}
