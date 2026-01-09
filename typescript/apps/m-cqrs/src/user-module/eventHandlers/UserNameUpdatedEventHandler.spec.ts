import { jest } from '@jest/globals'
import { UserNameUpdatedEventHandler } from './UserNameUpdatedEventHandler.js'
import { UserMainRepository } from '../projections/user-main.repository.js'
import knex from 'knex'
import { UserNameUpdatedV1 } from '../events/index.js'
import { Logger } from '@CQRS-variations-test/logger'
import { version } from 'uuid'

describe('UserNameUpdatedEventHandler', () => {
  describe('handle', () => {
    let repository: UserMainRepository
    let handler: UserNameUpdatedEventHandler

    beforeEach(() => {
      const db: knex.Knex = {} as knex.Knex
      db.table = jest
        .fn()
        .mockImplementation(() => ({ transacting: () => ({ forUpdate: () => ({ where: () => ({ first: () => {}}) }) }) })) as jest.Mocked<
        typeof db.table
      >
      db.transaction = jest.fn().mockImplementation(() => {
        const trx = jest
          .fn()
          .mockImplementation(() => ({ insert: () => ({ onConflict: () => ({ merge: () => {}, ignore: () => {} }) }) })) as jest.Mock & {
          commit: jest.Mock
          rollback: jest.Mock
        }
        trx.commit = jest.fn()
        trx.rollback = jest.fn()
  
        return trx
      }) as jest.MockedFunction<typeof db.transaction>
      repository = new UserMainRepository(db, {} as Logger)
      repository.update = jest.fn() as jest.Mocked<typeof repository.update>
      handler = new UserNameUpdatedEventHandler(repository)
    })

    const testCases = [
      {
        description: 'should call repository with specific event',
        payload: new UserNameUpdatedV1({ previousName: 'John Doe', name: 'Jack Doe', aggregateId: '1', aggregateVersion: 2 }),
        expectedArgument1: '1',
        expectedArgument2: { version: 2, name: 'Jack Doe' }
      }
    ]
    test.each(testCases)('$description', async ({ payload, expectedArgument1, expectedArgument2 }) => {
      await handler.handle(payload)

      expect(repository.update).toHaveBeenCalledWith(expectedArgument1, expectedArgument2)
    })
  })
})
