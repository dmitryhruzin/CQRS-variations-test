import { jest } from '@jest/globals'
import { GetPatientsMainQueryHandler } from './GetPatientsMainQueryHandler.js'
import { PatientMainRepository } from '../projections/patient-main.repository.js'
import knex from 'knex'
import { Logger } from '@CQRS-variations-test/logger'

describe('GetPatientsMainQueryHandler', () => {
  describe('execute', () => {
    let repository: PatientMainRepository
    let handler: GetPatientsMainQueryHandler

    beforeEach(() => {
      repository = new PatientMainRepository({} as knex.Knex, {} as Logger)
      repository.getAll = jest.fn() as jest.Mocked<typeof repository.getAll>
      handler = new GetPatientsMainQueryHandler(repository)
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
