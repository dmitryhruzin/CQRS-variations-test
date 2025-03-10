import { jest } from '@jest/globals'
import { EventStoreRepository } from '../event-store-module/event-store.repository.js'
import knex from 'knex'
import { Logger } from '@CQRS-variations-test/logger'
import { PaRepository } from './patient.repository.js'
import { PatientAggregate } from './patient.aggregate.js'
import { CreateUserCommand } from './commands/OnboardPatientCommand.js'

describe('UserRepository', () => {
  describe('buildUserAggregate', () => {
    let repository: UserRepository
    let db: knex.Knex = {} as knex.Knex

    beforeEach(() => {
      db.table = jest
        .fn()
        .mockImplementation(() => ({ where: () => ({ first: () => ({ id: '1', name: 'John', version: 2 })})})) as jest.Mocked<
        typeof db.table
      >
      repository = new UserRepository({} as EventStoreRepository, db)
    })

    const testCases = [
      {
        description: 'should build an aggregate using the latest snapshot',
        id: '1',
        expected: '{\"id\":\"1\",\"version\":2,\"name\":\"John\"}'
      },
      {
        description: 'should return an empty aggregate is thee is no ID specified',
        id: '',
        expected: '{\"version\":0}'
      }
    ]
    test.each(testCases)('$description', async ({ id, expected }) => {
      const result = await repository.buildUserAggregate(id)
      expect(JSON.stringify(result)).toEqual(expected)
    })

    test('should return an aggregate from cache', async () => {
      await repository.buildUserAggregate('2')
      await repository.buildUserAggregate('2')

      expect(db.table).toHaveBeenCalledTimes(1)
    })
  })

  describe('save', () => {
    const eventStore = new EventStoreRepository({} as knex.Knex, {} as Logger)
    eventStore.saveEvents = jest.fn() as jest.Mocked<typeof eventStore.saveEvents>
    const db: knex.Knex = {} as knex.Knex
    db.table = jest
      .fn()
      .mockImplementation(() => ({ insert: () => ({ onConflict: () => ({ merge: () => {}}) }) })) as jest.Mocked<
      typeof db.table
    >
    const repository = new UserRepository(eventStore, db)

    const testCases = [
      {
        description: 'should save events to the Event Sotre',
        getAggregate: () => {
          const aggregate = new UserAggregate()
          aggregate.create(new CreateUserCommand({ name: 'John Doe' }))
          return aggregate
        },
        expected: true
      },
      {
        description: 'should return an empty aggregate is thee is no ID specified',
        getAggregate: () => {
          return new UserAggregate()
        },
        expectedError: 'Aggregate is empty'
      }
    ]
    test.each(testCases)('$description', async ({ getAggregate, expected, expectedError }) => {
      try {
        const result = await repository.save(getAggregate(), [])
        expect(result).toEqual(expected)

        if (expectedError) {
          expect(true).toBeFalsy()
        }
      } catch (err) {
        if (!expectedError) {
          throw err
        }
        expect((err as Error).message).toEqual(expectedError)
      }
    })
  })
})
