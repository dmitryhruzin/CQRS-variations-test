import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { Logger } from '@CQRS-variations-test/logger'

@Injectable()
export class ProjectionBaseRepository {
  tableName: string

  snapshotTableName: string

  knexConnection: knex.Knex

  logger: Logger

  constructor(knexConnection: knex.Knex, logger: Logger, tableName: string) {
    this.knexConnection = knexConnection
    this.logger = logger
    this.tableName = tableName
    this.snapshotTableName = `${tableName}-snapshot`
  }

  async createSnapshot(lastEventID: number = 0) {
    await this.knexConnection.table(this.snapshotTableName).del()

    let records = await this.knexConnection.table(this.tableName).orderBy('id', 'asc').limit(100)

    while (records.length > 0) {
      // eslint-disable-next-line no-await-in-loop
      await this.knexConnection.table(this.snapshotTableName).insert(records.map((u) => ({ ...u, lastEventID })))

      this.logger.info(`Copied records from ${records[0].id} to ${records[records.length - 1].id}`)

      // eslint-disable-next-line no-await-in-loop
      records = await this.knexConnection
        .table(this.tableName)
        .where('id', '>', records[records.length - 1].id)
        .orderBy('id', 'asc')
        .limit(100)
    }

    this.logger.info('Snapshot created!')
  }

  async applySnapshot(): Promise<number> {
    await this.knexConnection.table(this.tableName).del()

    let records = await this.knexConnection.table(this.snapshotTableName).orderBy('id', 'asc').limit(100)

    const lastEventID = records.length ? records[records.length - 1].lastEventID : 0

    while (records.length > 0) {
      // eslint-disable-next-line no-await-in-loop
      await this.knexConnection.table(this.tableName).insert(
        records.map((r) => {
          const { lastEventID: omitted, ...record } = r
          return record
        })
      )

      this.logger.info(`Copied records from ${records[0].id} to ${records[records.length - 1].id}`)

      // eslint-disable-next-line no-await-in-loop
      records = await this.knexConnection
        .table(this.snapshotTableName)
        .where('id', '>', records[records.length - 1].id)
        .orderBy('id', 'asc')
        .limit(100)
    }

    this.logger.info('Snapshot applied!')
    return lastEventID
  }
}
