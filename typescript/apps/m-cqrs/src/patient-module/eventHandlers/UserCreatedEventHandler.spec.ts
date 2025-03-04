import { jest } from '@jest/globals'
import { UserCreatedEventHandler } from './UserCreatedEventHandler.js'
import { UserMainRepository } from '../projections/patient-main.repository.js'
import knex from 'knex'
import { UserCreatedV1 } from '../events/index.js'

describe('UserCreatedEventHandler', () => {
  describe('handle', () => {
    let repository: UserMainRepository
    let handler: UserCreatedEventHandler

    beforeEach(() => {
      repository = new UserMainRepository({} as knex.Knex)
      repository.save = jest.fn() as jest.Mocked<typeof repository.save>
      handler = new UserCreatedEventHandler(repository)
    })

    const testCases = [
      {
        description: 'should call repository with specific event',
        payload: new UserCreatedV1({ id: '1', name: 'John Doe', aggregateId: '1234', aggregateVersion: 1 }),
        expected: { id: '1', name: 'John Doe' }
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected }) => {
      await handler.handle(payload)

      expect(repository.save).toHaveBeenCalledWith(expected)
    })
  })
})
