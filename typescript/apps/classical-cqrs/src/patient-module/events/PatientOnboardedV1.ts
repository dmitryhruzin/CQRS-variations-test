import { PatientOnboardedV1EventPayload } from '../../types/patient.js'
import { PatientOnboarded } from './PatientOnboarded.js'

export class PatientOnboardedV1 extends PatientOnboarded {
  public id: string

  public name: string

  public version: number = 1

  constructor(payload: PatientOnboardedV1EventPayload) {
    super(payload)

    this.id = payload.id
    this.name = payload.name
  }

  toJson() {
    return {
      id: this.id,
      name: this.name
    }
  }
}
