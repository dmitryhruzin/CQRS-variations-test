import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { InjectLogger, Logger } from '@CQRS-variations-test/logger'
import { Patient, PatientUpdatePayload } from '../../types/patient.js'
import { VersionMismatchError } from '../../types/common.js'

@Injectable()
export class PatientMainRepository {
  private tableName: string = 'patients'

  // @ts-ignore
  constructor(
    @InjectConnection() private readonly knexConnection: knex.Knex,
    @InjectLogger(PatientMainRepository.name) private readonly logger: Logger
  ) {}

  async onModuleInit() {
    if (!(await this.knexConnection.schema.hasTable(this.tableName))) {
      await this.knexConnection.schema.createTable(this.tableName, (table) => {
        table.string('id').primary()
        table.string('name')
        table.jsonb('medicalHistory')
        table.integer('version')
      })
    }
  }

  async save(record: Patient): Promise<boolean> {
    await this.knexConnection
      .table(this.tableName)
      .insert([{ ...record, medicalHistory: JSON.stringify(record.medicalHistory), version: 1 }])

    return true
  }

  async update(id: string, payload: PatientUpdatePayload, tryCounter = 0): Promise<boolean> {
    const trx = await this.knexConnection.transaction()
    try {
      const patient = await this.knexConnection.table(this.tableName).transacting(trx).forUpdate().where({ id }).first()
      if (!patient || patient.version + 1 !== payload.version) {
        throw new VersionMismatchError(
          `Version mismatch for Patient with id: ${id}, current version: ${patient?.version}, new version: ${payload.version}`
        )
      }

      const medicalHistory = payload.medicalHistory ? payload.medicalHistory[0] : '{}'
      await this.knexConnection
        .table(this.tableName)
        .transacting(trx)
        .update({
          version: payload.version,
          name: payload.name,
          medicalHistory: this.knexConnection.raw('"medicalHistory" || ?', medicalHistory)
        })
        .where({ id })
      await trx.commit()

      return true
    } catch (e) {
      await trx.rollback()

      if (e instanceof VersionMismatchError) {
        if (tryCounter < 3) {
          setTimeout(() => this.update(id, payload, tryCounter + 1), 1000)
        } else {
          this.logger.warn(e)
        }
        return true
      }
      throw e
    }
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
