import { OnboardPatientRequest } from '../../types/patient.js'

export class OnboardPatientCommand {
  public readonly name: string

  constructor(public readonly payload: OnboardPatientRequest) {
    this.name = payload.name
  }
}
