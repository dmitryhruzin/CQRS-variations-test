import { jest } from '@jest/globals'
import { PatientAggregate } from './patient.aggregate.js'
import { OnboardPatientCommand } from './commands/OnboardPatientCommand.js'

describe('PatientAggregate', () => {
  describe('toJson', () => {
    const testCases = [
      {
        description: 'should return a js Object',
        getAggregate: () => {
          const aggregate = new PatientAggregate()
          aggregate.onboardPatient(new OnboardPatientCommand({ name: 'John Doe' }))
          return aggregate
        },
        expected: { name: 'John Doe' }
      },
      {
        description: 'should return a js Object',
        getAggregate: () => new PatientAggregate(),
        expectedError: 'Aggregate is empty'
      }
    ]
    test.each(testCases)('$description', ({ getAggregate, expected, expectedError }) => {
      try {
        const result = getAggregate().toJson()
        if (expected) {
          expect(result).toMatchObject(expected)
        }

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

  describe('onboardPatient', () => {
    let aggregate: PatientAggregate

    beforeEach(() => {
      aggregate = new PatientAggregate()
      aggregate.apply = jest.fn()
    })

    const testCases = [
      {
        description: 'should create new aggregate with new ID',
        payload: { name: 'John Doe' },
        expected: { name: 'John Doe' }
      },
      {
        description: 'should build an aggregate using existing event',
        payload: { id: '1', name: 'John Doe' },
        expected: { id: '1', name: 'John Doe' }
      }
    ]
    test.each(testCases)('$description', ({ payload, expected }) => {
      const result = aggregate.onboardPatient(new OnboardPatientCommand(payload))

      expect(aggregate.apply).toHaveBeenCalledTimes(1)
      expect(result[0].toJson().name).toEqual(expected.name)
    })
  })
})
