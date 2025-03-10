import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { PatientMainRepository } from '../projections/patient-main.repository.js'
import { GetPatientByIdMain } from '../queries/index.js'

@QueryHandler(GetPatientByIdMain)
export class GetPatientByIdMainQueryHandler implements IQueryHandler<GetPatientByIdMain> {
  constructor(private repository: PatientMainRepository) {}

  async execute(query: GetPatientByIdMain) {
    return this.repository.getById(query.id)
  }
}
