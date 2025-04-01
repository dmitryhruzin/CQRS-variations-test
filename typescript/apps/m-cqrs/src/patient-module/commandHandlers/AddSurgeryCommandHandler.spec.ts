import { jest } from '@jest/globals'
import knex from 'knex'
import { AddSurgeryCommandHandler } from './AddSurgeryCommandHandler.js'
import { EventPublisher } from '@nestjs/cqrs'
import { PatientRepository } from '../patient.repository.js'
import { EventStoreRepository } from '../../event-store-module/event-store.repository.js'
import { EventBus } from '@nestjs/cqrs/dist/event-bus.js'
import { AddSurgeryCommand } from '../commands/index.js'
import { SurgeryAddedV1 } from '../events/index.js'

describe('AddSurgeryCommandHandler', () => {
  describe('execute', () => {
    const events = [new SurgeryAddedV1({ id: '1231', aggregateId: '123', aggregateVersion: 1, label: 'Knee Replacement', doctorName: 'Dr John Doe' })]

    let repository: PatientRepository
    let aggregate: { addSurgery: (command: AddSurgeryCommand) => Event[]; commit: () => {} }
    let publisher: EventPublisher
    let handler: AddSurgeryCommandHandler

    beforeEach(() => {
      repository = new PatientRepository({} as EventStoreRepository, {} as knex.Knex)
      repository.save = jest.fn() as jest.Mocked<typeof repository.save>
      repository.buildAggregate = jest.fn() as jest.Mocked<typeof repository.buildAggregate>
      aggregate = {
        addSurgery: jest.fn().mockImplementation(() => events) as jest.Mocked<typeof aggregate.addSurgery>,
        commit: jest.fn() as jest.Mocked<typeof aggregate.commit>
      }
      publisher = new EventPublisher({} as EventBus)
      publisher.mergeObjectContext = jest.fn().mockImplementation(() => {
        return aggregate
      }) as jest.Mocked<typeof publisher.mergeObjectContext>
      handler = new AddSurgeryCommandHandler(repository, publisher)
    })

    const testCases = [
      {
        description: 'should update aggregate, save and commit events',
        payload: new AddSurgeryCommand({ patientId: '1234', surgery: { id: '1231', label: 'Knee Replacement', doctorName: 'Dr. John Doe' } }),
        expected: events
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected }) => {
      await handler.execute(payload)

      expect(repository.save).toHaveBeenCalledWith(aggregate, expected)
      expect(repository.buildAggregate).toHaveBeenCalledWith(payload.patientId)
      expect(aggregate.addSurgery).toHaveBeenCalledWith(payload)
      expect(aggregate.commit).toHaveBeenCalledTimes(1)
    })
  })
})
