import { v4 } from 'uuid'
import { AggregatePatientData, MedicalHistoryItem } from '../types/patient.js'
import { Aggregate } from '../aggregate-module/aggregate.js'
import { PatientOnboardedV1, SurgeryAddedV1 } from './events/index.js'
import { OnboardPatientCommand, AddSurgeryCommand } from './commands/index.js'

export class PatientAggregate extends Aggregate {
  private name: string

  private medicalHistory: MedicalHistoryItem[] = []

  constructor(data: AggregatePatientData | null = null) {
    if (!data) {
      super()
    } else {
      super(data.id, data.version)

      this.name = data.name
      this.medicalHistory = data.medicalHistory
    }
  }

  onboardPatient(command: OnboardPatientCommand) {
    this.id = v4()
    this.name = command.name

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

    const surgery = { ...command.surgery, id: v4() }
    const event = new SurgeryAddedV1({
      ...surgery,
      aggregateId: this.id,
      aggregateVersion: this.version
    })

    this.medicalHistory.push(surgery as unknown as MedicalHistoryItem)

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
      medicalHistory: this.medicalHistory
    }
  }
}
