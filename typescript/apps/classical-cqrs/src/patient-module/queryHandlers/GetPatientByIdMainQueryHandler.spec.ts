import { jest } from '@jest/globals'
import { Logger } from '@CQRS-variations-test/logger'
import { GetPatientByIdMainQueryHandler } from './GetPatientByIdMainQueryHandler.js'
import { PatientMainRepository } from '../projections/patient-main.repository.js'
import knex from 'knex'
import { GetPatientByIdMain } from '../queries/index.js'

describe('GetPatientByIdMainQueryHandler', () => {
  describe('execute', () => {
    let repository: PatientMainRepository
    let handler: GetPatientByIdMainQueryHandler

    beforeEach(() => {
      repository = new PatientMainRepository({} as knex.Knex, {} as Logger)
      repository.getById = jest.fn() as jest.Mocked<typeof repository.getById>
      handler = new GetPatientByIdMainQueryHandler(repository)
    })

    const testCases = [
      {
        description: 'should call repository with specific ID',
        payload: new GetPatientByIdMain('1'),
        expected: '1'
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected }) => {
      await handler.execute(payload)

      expect(repository.getById).toHaveBeenCalledWith(expected)
    })
  })
})
