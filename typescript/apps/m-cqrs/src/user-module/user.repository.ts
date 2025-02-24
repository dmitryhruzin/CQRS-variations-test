import { Injectable } from '@nestjs/common'
import knex from 'knex'
import { InjectConnection } from 'nest-knexjs'
import { Event } from '../types/common.js'
import { UserAggregate } from './user.aggregate.js'
import { EventStoreRepository } from '../event-store-module/event-store.repository.js'

/**
 * Repository for managing user aggregates.
 *
 * @class UserRepository
 */
@Injectable()
export class UserRepository {
  private tableName: string = 'aggregate-users'

  private cache: { [key: string]: UserAggregate } = {}

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
      })
    }
  }

  /**
   * Builds a user aggregate by ID.
   *
   * @param {string} [id] - The user ID (optional).
   * @returns {Promise<UserAggregate>} Promise resolving to the user aggregate.
   */
  async buildUserAggregate(id?: string): Promise<UserAggregate> {
    if (!id) {
      return new UserAggregate()
    }

    if (this.cache[id]) {
      return this.cache[id]
    }

    const userData = await this.knexConnection.table(this.tableName).where({ id }).first()
    const aggregate = new UserAggregate(userData)

    this.cache[id] = aggregate

    return aggregate
  }

  /**
   * Saves the user aggregate and events to the event store.
   *
   * @param {UserAggregate} aggregate - The user aggregate.
   * @param {Event[]} events - The events to save.
   * @returns {Promise<boolean>} Promise resolving to a boolean indicating success.
   */
  async save(aggregate: UserAggregate, events: Event[]): Promise<boolean> {
    const aggregateId = aggregate.toJson().id

    await this.eventStore.saveEvents(aggregateId, events)
    await this.knexConnection.table(this.tableName).insert(aggregate.toJson()).onConflict('id').merge()

    this.cache[aggregateId] = aggregate

    return true
  }
}
