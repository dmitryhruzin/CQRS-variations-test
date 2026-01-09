import { jest } from '@jest/globals'
import knex from 'knex'
import { UserEnterTheSystemCommandHandler } from './UserEnterTheSystemCommandHandler.js'
import { EventPublisher } from '@nestjs/cqrs'
import { UserRepository } from '../user.repository.js'
import { EventStoreRepository } from '../../event-store-module/event-store.repository.js'
import { EventBus } from '@nestjs/cqrs/dist/event-bus.js'
import { UserEnterTheSystemCommand } from '../commands/index.js'
import { UserEnteredTheSystemV1 } from '../events/index.js'

describe('UserEnterTheSystemCommandHandler', () => {
  describe('execute', () => {
    const events = [
      new UserEnteredTheSystemV1({ aggregateId: '123', aggregateVersion: 1 })
    ]

    let repository: UserRepository
    let aggregate: { enterTheSystem: (payload: UserEnterTheSystemCommand) => Event[]; commit: () => {} }
    let publisher: EventPublisher
    let handler: UserEnterTheSystemCommandHandler

    beforeEach(() => {
      repository = new UserRepository({} as EventStoreRepository, {} as knex.Knex)
      repository.save = jest.fn() as jest.Mocked<typeof repository.save>
      repository.buildUserAggregate = jest.fn() as jest.Mocked<typeof repository.buildUserAggregate>
      aggregate = {
        enterTheSystem: jest.fn().mockImplementation(() => events) as jest.Mocked<typeof aggregate.enterTheSystem>,
        commit: jest.fn() as jest.Mocked<typeof aggregate.commit>
      }
      publisher = new EventPublisher({} as EventBus)
      publisher.mergeObjectContext = jest.fn().mockImplementation(() => {
        return aggregate
      }) as jest.Mocked<typeof publisher.mergeObjectContext>
      handler = new UserEnterTheSystemCommandHandler(repository, publisher)
    })

    const testCases = [
      {
        description: 'should update aggregate, save and commit events',
        payload: new UserEnterTheSystemCommand({ id: '1234' }),
        expected: events
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected }) => {
      await handler.execute(payload)

      expect(repository.save).toHaveBeenCalledWith(aggregate, expected)
      expect(repository.buildUserAggregate).toHaveBeenCalledWith(payload.id)
      expect(aggregate.enterTheSystem).toHaveBeenCalledTimes(1)
      expect(aggregate.commit).toHaveBeenCalledTimes(1)
    })
  })
})
