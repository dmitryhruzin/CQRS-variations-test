import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { SurgeryAddedV1 } from '../events/index.js'
import { PatientMainRepository } from '../projections/patient-main.repository.js'

@EventsHandler(SurgeryAddedV1)
export class SurgeryAddedEventHandler implements IEventHandler<SurgeryAddedV1> {
  constructor(private repository: PatientMainRepository) {}

  async handle(event: SurgeryAddedV1) {
    await this.repository.update(event.aggregateId, {
      version: event.aggregateVersion,
      medicalHistory: [JSON.stringify({ label: event.label, doctorName: event.doctorName })]
    })
  }
}
