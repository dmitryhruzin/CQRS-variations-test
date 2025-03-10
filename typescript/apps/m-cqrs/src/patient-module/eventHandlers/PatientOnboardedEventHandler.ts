import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { PatientOnboardedV1 } from '../events/index.js'
import { PatientMainRepository } from '../projections/patient-main.repository.js'

@EventsHandler(PatientOnboardedV1)
export class PatientOnboardedEventHandler implements IEventHandler<PatientOnboardedV1> {
  constructor(private repository: PatientMainRepository) {}

  async handle(event: PatientOnboardedV1) {
    await this.repository.save({ ...event.toJson(), medicalHistory: [] })
  }
}
