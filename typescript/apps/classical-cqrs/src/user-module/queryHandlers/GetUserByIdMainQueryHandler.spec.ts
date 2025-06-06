import { jest } from '@jest/globals'
import { GetUserByIdMainQueryHandler } from './GetUserByIdMainQueryHandler.js'
import { UserMainRepository } from '../projections/user-main.repository.js'
import { EventStoreRepository } from '../../event-store-module/event-store.repository.js'
import knex from 'knex'
import { GetUserByIdMain } from '../queries/index.js'
import { Logger } from '@CQRS-variations-test/logger'

describe('GetUserByIdMainQueryHandler', () => {
  describe('execute', () => {
    let repository: UserMainRepository
    let handler: GetUserByIdMainQueryHandler

    beforeEach(() => {
      repository = new UserMainRepository({} as EventStoreRepository, {} as knex.Knex, {} as Logger)
      repository.getById = jest.fn() as jest.Mocked<typeof repository.getById>
      handler = new GetUserByIdMainQueryHandler(repository)
    })

    const testCases = [
      {
        description: 'should call repository with specific ID',
        payload: new GetUserByIdMain('1'),
        expected: '1'
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected }) => {
      await handler.execute(payload)

      expect(repository.getById).toHaveBeenCalledWith(expected)
    })
  })
})
