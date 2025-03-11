import { jest } from '@jest/globals'
import { EventStoreRepository } from '../event-store-module/event-store.repository.js'
import knex from 'knex'
import { Logger } from '@CQRS-variations-test/logger'
import { PatientRepository } from './patient.repository.js'
import { PatientAggregate } from './patient.aggregate.js'
import { OnboardPatientCommand } from './commands/OnboardPatientCommand.js'

describe('PatientRepository', () => {
  describe('buildAggregate', () => {
    let repository: PatientRepository
    let db: knex.Knex = {} as knex.Knex

    beforeEach(() => {
      db.table = jest
        .fn()
        .mockImplementation(() => ({ where: () => ({ first: () => ({ id: '1', name: 'John', version: 2 })})})) as jest.Mocked<
        typeof db.table
      >
      repository = new PatientRepository({} as EventStoreRepository, db)
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
        expected: '{\"version\":0,\"medicalHistory\":[]}'
      }
    ]
    test.each(testCases)('$description', async ({ id, expected }) => {
      const result = await repository.buildAggregate(id)
      expect(JSON.stringify(result)).toEqual(expected)
    })

    test('should return an aggregate from cache', async () => {
      await repository.buildAggregate('2')
      await repository.buildAggregate('2')

      expect(db.table).toHaveBeenCalledTimes(1)
    })
  })

  describe('save', () => {
    const eventStore = new EventStoreRepository({} as knex.Knex, {} as Logger)
    eventStore.saveEvents = jest.fn() as jest.Mocked<typeof eventStore.saveEvents>
    const db: knex.Knex = {} as knex.Knex
    db.table = jest
      .fn()
      .mockImplementation(() => ({ insert: () => ({ onConflict: () => ({ merge: () => {} }) }) })) as jest.Mocked<
      typeof db.table
    >
    db.transaction = jest.fn().mockImplementation(() => {
      const trx = jest
        .fn()
        .mockImplementation(() => ({ insert: () => ({ onConflict: () => ({ merge: () => {} }) }) })) as jest.Mock & {
        commit: jest.Mock
        rollback: jest.Mock
      }
      trx.commit = jest.fn()
      trx.rollback = jest.fn()

      return trx
    }) as jest.MockedFunction<typeof db.transaction>
    const repository = new PatientRepository(eventStore, db)

    const testCases = [
      {
        description: 'should save events to the Event Sotre',
        getAggregate: () => {
          const aggregate = new PatientAggregate()
          aggregate.onboardPatient(new OnboardPatientCommand({ name: 'John Doe' }))
          return aggregate
        },
        expected: true
      },
      {
        description: 'should return an empty aggregate is thee is no ID specified',
        getAggregate: () => {
          return new PatientAggregate()
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
