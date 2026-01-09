import { jest } from '@jest/globals'
import knex from 'knex'
import { UserExitTheSystemCommandHandler } from './UserExitTheSystemCommandHandler.js'
import { EventPublisher } from '@nestjs/cqrs'
import { UserRepository } from '../user.repository.js'
import { EventStoreRepository } from '../../event-store-module/event-store.repository.js'
import { EventBus } from '@nestjs/cqrs/dist/event-bus.js'
import { UserExitTheSystemCommand } from '../commands/index.js'
import { UserExitedTheSystemV1 } from '../events/index.js'

describe('UserExitTheSystemCommandHandler', () => {
  describe('execute', () => {
    const events = [
      new UserExitedTheSystemV1({ aggregateId: '123', aggregateVersion: 1 })
    ]

    let repository: UserRepository
    let aggregate: { exitTheSystem: (payload: UserExitTheSystemCommand) => Event[]; commit: () => {} }
    let publisher: EventPublisher
    let handler: UserExitTheSystemCommandHandler

    beforeEach(() => {
      repository = new UserRepository({} as EventStoreRepository, {} as knex.Knex)
      repository.save = jest.fn() as jest.Mocked<typeof repository.save>
      repository.buildUserAggregate = jest.fn() as jest.Mocked<typeof repository.buildUserAggregate>
      aggregate = {
        exitTheSystem: jest.fn().mockImplementation(() => events) as jest.Mocked<typeof aggregate.exitTheSystem>,
        commit: jest.fn() as jest.Mocked<typeof aggregate.commit>
      }
      publisher = new EventPublisher({} as EventBus)
      publisher.mergeObjectContext = jest.fn().mockImplementation(() => {
        return aggregate
      }) as jest.Mocked<typeof publisher.mergeObjectContext>
      handler = new UserExitTheSystemCommandHandler(repository, publisher)
    })

    const testCases = [
      {
        description: 'should update aggregate, save and commit events',
        payload: new UserExitTheSystemCommand({ id: '1234' }),
        expected: events
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected }) => {
      await handler.execute(payload)

      expect(repository.save).toHaveBeenCalledWith(aggregate, expected)
      expect(repository.buildUserAggregate).toHaveBeenCalledWith(payload.id)
      expect(aggregate.exitTheSystem).toHaveBeenCalledTimes(1)
      expect(aggregate.commit).toHaveBeenCalledTimes(1)
    })
  })
})
