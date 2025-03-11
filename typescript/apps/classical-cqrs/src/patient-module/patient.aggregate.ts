import { v4 } from 'uuid'
import { AggregatePatientData } from '../types/patient.js'
import { Aggregate } from '../aggregate-module/aggregate.js'
import { PatientOnboardedV1, SurgeryAddedV1 } from './events/index.js'
import { OnboardPatientCommand, AddSurgeryCommand } from './commands/index.js'
import { Snapshot } from '../types/common.js'

export class PatientAggregate extends Aggregate {
  private name: string

  private medicalHistory: string[] = []

  constructor(snapshot: Snapshot<PatientAggregate> = null) {
    if (!snapshot) {
      super()
    } else {
      super(snapshot.aggregateId, snapshot.aggregateVersion)

      if (snapshot.state) {
        this.name = snapshot.state.name
        this.medicalHistory = snapshot.state.medicalHistory
      }
    }
  }

  onboardPatient(command: OnboardPatientCommand) {
    this.id = v4()

    const event = new PatientOnboardedV1({
      id: this.id,
      name: command.name,
      aggregateId: this.id,
      aggregateVersion: this.version + 1
    })

    this.apply(event)

    return [event]
  }

  replayPatientOnboardedV1(event: PatientOnboardedV1) {
    this.id = event.id
    this.name = event.name

    this.version += 1
  }

  addSurgery(command: AddSurgeryCommand) {
    const event = new SurgeryAddedV1({
      label: command.surgery.label,
      doctorName: command.surgery.doctorName,
      aggregateId: this.id,
      aggregateVersion: this.version + 1
    })

    this.apply(event)

    return [event]
  }

  replaySurgeryAddedV1(event: SurgeryAddedV1) {
    this.medicalHistory.push(JSON.stringify({ label: event.label, doctorName: event.doctorName }))

    this.version += 1
  }

  toJson(): AggregatePatientData {
    if (!this.id) {
      throw new Error('Aggregate is empty')
    }

    return {
      id: this.id,
      version: this.version,
      name: this.name,
      medicalHistory: this.medicalHistory
    }
  }
}
