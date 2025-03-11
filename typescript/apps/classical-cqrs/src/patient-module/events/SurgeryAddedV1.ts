import { SurgeryAddedV1EventPayload } from '../../types/patient.js'
import { SurgeryAdded } from './SurgeryAdded.js'

export class SurgeryAddedV1 extends SurgeryAdded {
  public label: string

  public doctorName: string

  public version: number = 1

  constructor(payload: SurgeryAddedV1EventPayload) {
    super(payload)

    this.label = payload.label
    this.doctorName = payload.doctorName
  }

  toJson() {
    return {
      label: this.label,
      doctorName: this.doctorName
    }
  }
}
