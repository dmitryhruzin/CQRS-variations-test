import { jest } from '@jest/globals'
import knex from 'knex'
import { UpdateUserNameCommandHandler } from './UpdateUserNameCommandHandler.js'
import { EventPublisher } from '@nestjs/cqrs'
import { UserRepository } from '../user.repository.js'
import { EventStoreRepository } from '../../event-store-module/event-store.repository.js'
import { EventBus } from '@nestjs/cqrs/dist/event-bus.js'
import { UpdateUserNameCommand } from '../commands/index.js'
import { UserNameUpdatedV1 } from '../events/index.js'

describe('UpdateUserNameCommandHandler', () => {
  describe('execute', () => {
    const events = [new UserNameUpdatedV1({ aggregateId: '123', aggregateVersion: 1, previousName: 'John', name: 'John Doe' })]

    let repository: UserRepository
    let aggregate: { updateName: (user: UpdateUserNameCommand) => Event[]; commit: () => {} }
    let publisher: EventPublisher
    let handler: UpdateUserNameCommandHandler

    beforeEach(() => {
      repository = new UserRepository({} as EventStoreRepository, {} as knex.Knex)
      repository.save = jest.fn() as jest.Mocked<typeof repository.save>
      repository.buildUserAggregate = jest.fn() as jest.Mocked<typeof repository.buildUserAggregate>
      aggregate = {
        updateName: jest.fn().mockImplementation(() => events) as jest.Mocked<typeof aggregate.updateName>,
        commit: jest.fn() as jest.Mocked<typeof aggregate.commit>
      }
      publisher = new EventPublisher({} as EventBus)
      publisher.mergeObjectContext = jest.fn().mockImplementation(() => {
        return aggregate
      }) as jest.Mocked<typeof publisher.mergeObjectContext>
      handler = new UpdateUserNameCommandHandler(repository, publisher)
    })

    const testCases = [
      {
        description: 'should update aggregate, save and commit events',
        payload: new UpdateUserNameCommand({ id: '1234', name: 'John Doe' }),
        expected: events
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected }) => {
      await handler.execute(payload)

      expect(repository.save).toHaveBeenCalledWith(aggregate, expected)
      expect(repository.buildUserAggregate).toHaveBeenCalledWith(payload.id)
      expect(aggregate.updateName).toHaveBeenCalledWith(payload)
      expect(aggregate.commit).toHaveBeenCalledTimes(1)
    })
  })
})
