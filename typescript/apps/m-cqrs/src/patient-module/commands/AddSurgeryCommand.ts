import { AddSurgeryRequest, Surgery } from '../../types/patient.js'

export class AddSurgeryCommand {
  public readonly patientId: string

  public readonly surgery: Surgery

  constructor(public readonly payload: AddSurgeryRequest) {
    this.patientId = payload.patientId
    this.surgery = payload.surgery
  }
}
