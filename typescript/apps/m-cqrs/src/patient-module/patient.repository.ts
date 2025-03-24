import { Injectable } from '@nestjs/common'
import knex from 'knex'
import { InjectConnection } from 'nest-knexjs'
import { Event } from '../types/common.js'
import { PatientAggregate } from './patient.aggregate.js'
import { EventStoreRepository } from '../event-store-module/event-store.repository.js'

/**
 * Repository for managing patient aggregates.
 *
 * @class PatientRepository
 */
@Injectable()
export class PatientRepository {
  private tableName: string = 'aggregate-patients'

  private medicalHistoryTableName: string = 'aggregate-medical-histories'

  private cache: { [key: string]: PatientAggregate } = {}

  constructor(
    private readonly eventStore: EventStoreRepository,
    @InjectConnection() private readonly knexConnection: knex.Knex
  ) {}

  async onModuleInit() {
    if (!(await this.knexConnection.schema.hasTable(this.tableName))) {
      await this.knexConnection.schema.createTable(this.tableName, (table) => {
        table.string('id').primary()
        table.integer('version')
        table.string('name')
      })
    }
    if (!(await this.knexConnection.schema.hasTable(this.medicalHistoryTableName))) {
      await this.knexConnection.schema.createTable(this.medicalHistoryTableName, (table) => {
        table.string('id').primary()
        table.string('label')
        table.string('doctorName')
        table.string('aggregateId')
        table.date('date')
      })
    }
  }

  async buildAggregate(id?: string): Promise<PatientAggregate> {
    if (!id) {
      return new PatientAggregate()
    }

    if (this.cache[id]) {
      return this.cache[id]
    }

    const query = `
      SELECT
          "${this.tableName}"."id" AS "id",
          "${this.tableName}"."name" AS "name",
          "${this.tableName}"."version" AS "version",
          json_agg(
              json_build_object(
                  'id', "${this.medicalHistoryTableName}"."id",
                  'label', "${this.medicalHistoryTableName}"."label",
                  'doctorName', "${this.medicalHistoryTableName}"."doctorName",
                  'date', "${this.medicalHistoryTableName}"."date"
              )
          ) AS "medicalHistory"
      FROM
          "${this.tableName}"
      INNER JOIN
          "${this.medicalHistoryTableName}"
      ON
          "${this.tableName}"."id" = "${this.medicalHistoryTableName}"."aggregateId"
      WHERE
          "${this.tableName}"."id" = '${id}'
      GROUP BY
          "${this.tableName}"."id",
          "${this.tableName}"."name",
          "${this.tableName}"."version"
      LIMIT 1;
    `

    const data = (await this.knexConnection.raw(query)).rows[0]

    const aggregate = new PatientAggregate(data)

    this.cache[id] = aggregate

    return aggregate
  }

  async save(aggregate: PatientAggregate, events: Event[]): Promise<boolean> {
    const aggregateId = aggregate.toJson().id

    const trx = await this.knexConnection.transaction()
    try {
      await this.eventStore.saveEvents(aggregateId, events, trx)

      const data = aggregate.toJson()
      const { medicalHistory, ...patientPayload } = data

      await trx(this.tableName)
        .insert({ ...patientPayload })
        .onConflict('id')
        .merge()

      await trx(this.medicalHistoryTableName)
        .insert(medicalHistory.map((mh) => ({ ...mh, aggregateId, date: new Date() })))
        .onConflict('id')
        .ignore()

      await trx.commit()
    } catch (e) {
      await trx.rollback()
      throw new Error(`Can not save events. ${e}`)
    }

    this.cache[aggregateId] = aggregate

    return true
  }
}
