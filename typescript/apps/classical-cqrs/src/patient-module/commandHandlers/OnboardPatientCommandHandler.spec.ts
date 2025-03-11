import { jest } from '@jest/globals'
import knex from 'knex'
import { OnboardPatientCommandHandler } from './OnboardPatientCommandHandler.js'
import { EventPublisher } from '@nestjs/cqrs'
import { PatientRepository } from '../patient.repository.js'
import { EventStoreRepository } from '../../event-store-module/event-store.repository.js'
import { EventBus } from '@nestjs/cqrs/dist/event-bus.js'
import { OnboardPatientCommand } from '../commands/index.js'
import { PatientOnboardedV1 } from '../events/index.js'
import { AggregateSnapshotRepository } from '../../aggregate-module/aggregate-snapshot.repository.js'

describe('OnboardPatientCommandHandler', () => {
  describe('execute', () => {
    const events = [new PatientOnboardedV1({ aggregateId: '123', aggregateVersion: 1, id: '1', name: 'John Doe' })]

    let repository: PatientRepository
    let aggregate: { onboardPatient: (patient: OnboardPatientCommand) => Event[]; commit: () => {} }
    let publisher: EventPublisher
    let handler: OnboardPatientCommandHandler

    beforeEach(() => {
      repository = new PatientRepository({} as EventStoreRepository, {} as AggregateSnapshotRepository)
      repository.save = jest.fn() as jest.Mocked<typeof repository.save>
      aggregate = {
        onboardPatient: jest.fn().mockImplementation(() => events) as jest.Mocked<typeof aggregate.onboardPatient>,
        commit: jest.fn() as jest.Mocked<typeof aggregate.commit>
      }
      publisher = new EventPublisher({} as EventBus)
      publisher.mergeObjectContext = jest.fn().mockImplementation(() => {
        return aggregate
      }) as jest.Mocked<typeof publisher.mergeObjectContext>
      handler = new OnboardPatientCommandHandler(repository, publisher)
    })

    const testCases = [
      {
        description: 'should update aggregate, save and commit events',
        payload: new OnboardPatientCommand({ name: 'John Doe' }),
        expected: events
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected }) => {
      await handler.execute(payload)

      expect(repository.save).toHaveBeenCalledWith(aggregate, expected)
      expect(aggregate.onboardPatient).toHaveBeenCalledWith(payload)
      expect(aggregate.commit).toHaveBeenCalledTimes(1)
    })
  })
})
