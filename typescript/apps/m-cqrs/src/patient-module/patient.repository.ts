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

  // @ts-ignore
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
        table.string('medicalHistory') // Example patient-specific field
      })
    }
  }

  /**
   * Builds a patient aggregate by ID.
   *
   * @param {string} [id] - The patient ID (optional).
   * @returns {Promise<PatientAggregate>} Promise resolving to the patient aggregate.
   */
  async buildUserAggregate(id?: string): Promise<PatientAggregate> {
    if (!id) {
      return new PatientAggregate()
    }

    if (this.cache[id]) {
      return this.cache[id]
    }

    const userData = await this.knexConnection.table(this.tableName).where({ id }).first()
    const aggregate = new PatientAggregate(userData)

    this.cache[id] = aggregate

    return aggregate
  }

  /**
   * Saves the patient aggregate and events to the event store.
   *
   * @param {PatientAggregate} aggregate - The patient aggregate.
   * @param {Event[]} events - The events to save.
   * @returns {Promise<boolean>} Promise resolving to a boolean indicating success.
   */
  async save(aggregate: PatientAggregate, events: Event[]): Promise<boolean> {
    const aggregateId = aggregate.toJson().id

    await this.eventStore.saveEvents(aggregateId, events)
    await this.knexConnection.table(this.tableName).insert(aggregate.toJson()).onConflict('id').merge()

    this.cache[aggregateId] = aggregate

    return true
  }
}
