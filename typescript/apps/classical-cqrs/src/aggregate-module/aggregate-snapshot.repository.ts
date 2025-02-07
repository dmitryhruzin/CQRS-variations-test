import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { InjectLogger, Logger } from '@CQRS-variations-test/logger'
import { Aggregate } from '../aggregate-module/aggregate.js'
import { StoredEvent } from '../types/common.js'

@Injectable()
export class AggregateSnapshotRepository {
  private tableName: string = 'snapshots'

  constructor(
    @InjectConnection() private readonly knexConnection: knex.Knex,
    @InjectLogger(AggregateSnapshotRepository.name) private readonly logger: Logger
  ) {}

  async onModuleInit() {
    if (!(await this.knexConnection.schema.hasTable(this.tableName))) {
      await this.knexConnection.schema.createTable(this.tableName, (table) => {
        table.increments('id').primary()
        table.string('aggregateId')
        table.integer('aggregateVersion')
        table.jsonb('state')
      })
    }
  }

  async getLatestSnapshotByAggregateId(id: string): Promise<StoredEvent[]> {
    return this.knexConnection.table(this.tableName).where({ aggregateId: id }).orderBy('version', 'desc').first()
  }

  async saveSnapshot(aggregate: Aggregate): Promise<boolean> {
    if (!aggregate) {
      this.logger.warn('Can not save snapshot. Aggregate is not defined.')
      return false
    }

    const result = await this.knexConnection.table(this.tableName).insert({
      aggregateId: aggregate.id,
      aggregateVersion: aggregate.version,
      state: aggregate.toJson()
    })
    this.logger.info({ message: 'saveEvents result:', body: result })

    return true
  }
}
