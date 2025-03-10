import { v4 } from 'uuid'
import { AggregatePatientData } from '../types/patient.js'
import { Aggregate } from '../aggregate-module/aggregate.js'
import { PatientOnboardedV1, SurgeryAddedV1 } from './events/index.js'
import { OnboardPatientCommand, AddSurgeryCommand } from './commands/index.js'

export class PatientAggregate extends Aggregate {
  private name: string

  private medicalHistory: string[] = []

  constructor(data: AggregatePatientData | null = null) {
    if (!data) {
      super()
    } else {
      super(data.id, data.version)

      this.name = data.name
      this.medicalHistory = data.madicalHistory
    }
  }

  onboartPatient(patient: OnboardPatientCommand) {
    this.id = v4()
    this.name = patient.name

    this.version += 1

    const event = new PatientOnboardedV1({
      id: this.id,
      name: this.name,
      aggregateId: this.id,
      aggregateVersion: this.version
    })

    this.apply(event)

    return [event]
  }

  addSurgery(command: AddSurgeryCommand) {
    this.version += 1

    const event = new SurgeryAddedV1({
      label: command.surgery.label,
      doctorName: command.surgery.doctorName,
      aggregateId: this.id,
      aggregateVersion: this.version
    })

    this.medicalHistory.push(JSON.stringify(command.surgery))

    this.apply(event)

    return [event]
  }

  toJson(): AggregatePatientData {
    if (!this.id) {
      throw new Error('Aggregate is empty')
    }

    return {
      id: this.id,
      version: this.version,
      name: this.name,
      madicalHistory: this.medicalHistory
    }
  }
}
