import knex from 'knex'
import { Logger } from '@CQRS-variations-test/logger'
import { EventStoreRepository } from './event-store.repository.js'
import { Event } from '../types/common.js'

describe('EventStoreRepository', () => {
  const logger = new Logger({})
  let db: knex.Knex

  beforeAll(() => {
    db = knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './test.db'
      }
    })
  })

  afterAll(async () => {
    await db.schema.dropTable('events')
    await db.destroy()
  })

  describe('saveEvents', () => {
    const EVENTS_MOCK: Event[] = [
      { aggregateId: '123', aggregateVersion: 1, version: 1, toJson: () => JSON.stringify({ name: 'John Doe' }) },
      { aggregateId: '123', aggregateVersion: 2, version: 1, toJson: () => JSON.stringify({ name: 'John Smith' }) }
    ]

    let repo: EventStoreRepository

    beforeAll(async () => {
      repo = new EventStoreRepository(db, logger)
      await repo.onModuleInit()
    })

    const testCases = [
      {
        description: 'should save new events',
        id: '4',
        events: EVENTS_MOCK,
        expected: true,
        saved: [
          { aggregateId: '4', body: JSON.stringify({ name: 'John Doe' }), version: 1, aggregateVersion: 1 },
          { aggregateId: '4', body: JSON.stringify({ name: 'John Smith' }), version: 1, aggregateVersion: 2 }
        ]
      },
      {
        description: 'should not save events with no ID',
        id: '',
        events: EVENTS_MOCK,
        expected: false,
        saved: []
      }
    ]
    test.each(testCases)('$description', async ({ id, events, expected, saved }) => {
      const result = await repo.saveEvents(id, events)
      expect(result).toEqual(expected)

      const savedData = await db.table('events').where({ aggregateId: id })
      expect(savedData.sort()).toMatchObject(saved.sort())
    })
  })
})
