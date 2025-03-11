import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { PatientMainRepository } from '../projections/patient-main.repository.js'
import { GetPatientsMain } from '../queries/index.js'

@QueryHandler(GetPatientsMain)
export class GetPatientsMainQueryHandler implements IQueryHandler<GetPatientsMain> {
  constructor(private repository: PatientMainRepository) {}

  async execute() {
    return this.repository.getAll()
  }
}
