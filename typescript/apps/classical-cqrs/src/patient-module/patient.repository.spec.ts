import { jest } from '@jest/globals'
import { EventStoreRepository } from '../event-store-module/event-store.repository.js'
import { AggregateSnapshotRepository } from '../aggregate-module/aggregate-snapshot.repository.js'
import knex from 'knex'
import { Logger } from '@CQRS-variations-test/logger'
import { PatientRepository } from './patient.repository.js'
import { PatientAggregate } from './patient.aggregate.js'
import { OnboardPatientCommand } from './commands/OnboardPatientCommand.js'

describe('PatientRepository', () => {
  describe('buildAggregate', () => {
    let repository: PatientRepository
    let eventStore: EventStoreRepository
    let snapshotRepository: AggregateSnapshotRepository

    beforeEach(() => {
      eventStore = new EventStoreRepository({} as knex.Knex, {} as Logger)
      eventStore.getEventsByAggregateId = jest
        .fn()
        .mockImplementation(() => [
          { name: 'SurgeryAdded', aggregateVersion: 2, version: 1, body: { Label: 'Knee Replacement', doctorName: 'Dr. Smith' } },
          { name: 'PatientOnboarded', aggregateVersion: 1, version: 1, body: { name: 'John Doe' } },
        ]) as jest.Mocked<typeof eventStore.getEventsByAggregateId>
      snapshotRepository = new AggregateSnapshotRepository({} as knex.Knex, {} as Logger)
      snapshotRepository.getLatestSnapshotByAggregateId = jest.fn().mockImplementation(() => ({
        id: '123',
        aggregateVersion: 1,
        aggregateId: '123',
        state: { name: 'test', medicalHistory: [] },
      })) as jest.Mocked<typeof snapshotRepository.getLatestSnapshotByAggregateId>
      repository = new PatientRepository(eventStore, snapshotRepository)
    })

    const testCases = [
      {
        description: 'should build an aggregate using events from Event Store',
        id: '1',
        expected: '{\"version\":3,\"name\":\"John Doe\",\"medicalHistory\":[\"{\\\"doctorName\\\":\\\"Dr. Smith\\\"}\"]}'
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

      expect(snapshotRepository.getLatestSnapshotByAggregateId).toHaveBeenCalledTimes(1)
    })
  })

  describe('save', () => {
    const eventStore = new EventStoreRepository({} as knex.Knex, {} as Logger)
    eventStore.saveEvents = jest.fn() as jest.Mocked<typeof eventStore.saveEvents>
    const snapshotRepository = new AggregateSnapshotRepository({} as knex.Knex, {} as Logger)
    snapshotRepository.saveSnapshot = jest.fn() as jest.Mocked<typeof snapshotRepository.saveSnapshot>
    const repository = new PatientRepository(eventStore, snapshotRepository)

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
