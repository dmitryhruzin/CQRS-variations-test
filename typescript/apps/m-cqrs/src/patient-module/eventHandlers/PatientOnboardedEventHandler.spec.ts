import { jest } from '@jest/globals'
import knex from 'knex'
import { Logger } from '@CQRS-variations-test/logger'
import { PatientOnboardedEventHandler } from './PatientOnboardedEventHandler.js'
import { PatientMainRepository } from '../projections/patient-main.repository.js'
import { PatientOnboardedV1 } from '../events/index.js'

describe('PatientOnboardedEventHandler', () => {
  describe('handle', () => {
    let repository: PatientMainRepository
    let handler: PatientOnboardedEventHandler

    beforeEach(() => {
      repository = new PatientMainRepository({} as knex.Knex, {} as Logger)
      repository.save = jest.fn() as jest.Mocked<typeof repository.save>
      handler = new PatientOnboardedEventHandler(repository)
    })

    const testCases = [
      {
        description: 'should call repository with specific event',
        payload: new PatientOnboardedV1({ id: '1', name: 'John Doe', aggregateId: '1234', aggregateVersion: 1 }),
        expected: { id: '1', name: 'John Doe', medicalHistory: [] }
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected }) => {
      await handler.handle(payload)

      expect(repository.save).toHaveBeenCalledWith(expected)
    })
  })
})
