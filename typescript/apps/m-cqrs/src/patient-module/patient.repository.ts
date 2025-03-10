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
        table.string('medicalHistory')
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

    const data = await this.knexConnection.table(this.tableName).where({ id }).first()
    const aggregate = new PatientAggregate(data)

    this.cache[id] = aggregate

    return aggregate
  }

  async save(aggregate: PatientAggregate, events: Event[]): Promise<boolean> {
    const aggregateId = aggregate.toJson().id

    const trx = await this.knexConnection.transaction()
    try {
      await this.eventStore.saveEvents(aggregateId, events, trx)

      await trx(this.tableName).insert(aggregate.toJson()).onConflict('id').merge()
      await trx.commit()
    } catch (e) {
      await trx.rollback()
      throw new Error(`Can not save events. ${e}`)
    }

    this.cache[aggregateId] = aggregate

    return true
  }
}
