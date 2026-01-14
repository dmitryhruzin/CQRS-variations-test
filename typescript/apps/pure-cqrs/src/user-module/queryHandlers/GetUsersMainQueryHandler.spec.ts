import { jest } from '@jest/globals'
import { GetUsersMainQueryHandler } from './GetUsersMainQueryHandler.js'
import { UserMainRepository } from '../projections/user-main.repository.js'
import { EventStoreRepository } from '../../event-store-module/event-store.repository.js'
import knex from 'knex'
import { Logger } from '@CQRS-variations-test/logger'

describe('GetUsersMainQueryHandler', () => {
  describe('execute', () => {
    let repository: UserMainRepository
    let handler: GetUsersMainQueryHandler

    beforeEach(() => {
      repository = new UserMainRepository({} as EventStoreRepository, {} as knex.Knex, {} as Logger)
      repository.getAll = jest.fn() as jest.Mocked<typeof repository.getAll>
      handler = new GetUsersMainQueryHandler(repository)
    })

    const testCases = [
      {
        description: 'should call repository'
      }
    ]
    test.each(testCases)('$description', async () => {
      await handler.execute()

      expect(repository.getAll).toHaveBeenCalledTimes(1)
    })
  })
})
