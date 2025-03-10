import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { Patient, PatientUpdatePayload } from '../../types/patient.js'

@Injectable()
export class PatientMainRepository {
  private tableName: string = 'patients'

  // @ts-ignore
  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  async onModuleInit() {
    if (!(await this.knexConnection.schema.hasTable(this.tableName))) {
      await this.knexConnection.schema.createTable(this.tableName, (table) => {
        table.string('id').primary()
        table.string('name')
        table.jsonb('medicalHistory')
      })
    }
  }

  async save(record: Patient): Promise<boolean> {
    await this.knexConnection.table(this.tableName).insert([record])

    return true
  }

  async update(id: string, payload: PatientUpdatePayload): Promise<boolean> {
    await this.knexConnection
      .table(this.tableName)
      .update({
        name: payload.name,
        medicalHistory: payload.madicalHistory
      })
      .where({ id })

    return true
  }

  async getAll(): Promise<Patient[]> {
    return this.knexConnection.table(this.tableName)
  }

  async getById(id: string): Promise<Patient> {
    const record = await this.knexConnection.table(this.tableName).where({ id }).first()

    if (!record) {
      throw new Error(`Patient with id: ${id} not found`)
    }

    return record
  }
}
