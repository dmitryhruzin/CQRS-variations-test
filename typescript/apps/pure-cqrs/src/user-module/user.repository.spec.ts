import { jest } from '@jest/globals'
import { EventStoreRepository } from '../event-store-module/event-store.repository.js'
import knex from 'knex'
import { Logger } from '@CQRS-variations-test/logger'
import { UserRepository } from './user.repository.js'
import { UserAggregate } from './user.aggregate.js'
import { CreateUserCommand } from './commands/CreateUserCommand.js'

describe('UserRepository', () => {
  describe('buildUserAggregate', () => {
    let repository: UserRepository
    let eventStore: EventStoreRepository

    beforeEach(() => {
      eventStore = new EventStoreRepository({} as knex.Knex, {} as Logger)
      eventStore.getEventsByAggregateId = jest
        .fn()
        .mockImplementation(() => [
          { name: 'UserCreated', aggregateVersion: 1, body: { id: '123' } },
          { name: 'UserNameUpdated', aggregateVersion: 2, body: { name: 'John Doe' } }
        ]) as jest.Mocked<typeof eventStore.getEventsByAggregateId>
      repository = new UserRepository(eventStore)
    })

    const testCases = [
      {
        description: 'should build an aggregate using events from Event Store',
        id: '1',
        expected: '{"id":"123","version":2,"name":"John Doe"}'
      },
      {
        description: 'should return an empty aggregate is thee is no ID specified',
        id: '',
        expected: '{"version":0}'
      }
    ]
    test.each(testCases)('$description', async ({ id, expected }) => {
      const result = await repository.buildUserAggregate(id)
      expect(JSON.stringify(result)).toEqual(expected)
    })

    test('should return an aggregate from cache', async () => {
      await repository.buildUserAggregate('2')
      await repository.buildUserAggregate('2')

      expect(eventStore.getEventsByAggregateId).toHaveBeenNthCalledWith(1, '2', 0)
      expect(eventStore.getEventsByAggregateId).toHaveBeenNthCalledWith(2, '2', 2)
    })
  })

  describe('save', () => {
    const eventStore = new EventStoreRepository({} as knex.Knex, {} as Logger)
    eventStore.saveEvents = jest.fn() as jest.Mocked<typeof eventStore.saveEvents>
    const repository = new UserRepository(eventStore)

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
