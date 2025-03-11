import { jest } from '@jest/globals'
import { PatientController } from './patient.controller.js'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { OnboardPatientCommand } from './commands/index.js'
import { ModuleRef } from '@nestjs/core/injector/module-ref.js'
import { GetPatientsMain, GetPatientByIdMain } from './queries/index.js'

describe('PatientController', () => {
  describe('createUser', () => {
    const commandBus = new CommandBus({} as ModuleRef)
    commandBus.execute = jest.fn() as jest.Mocked<typeof commandBus.execute>
    const controller = new PatientController(commandBus, {} as QueryBus)

    const testCases = [
      {
        description: 'should create CreateUserCommand',
        payload: { name: 'John Doe' },
        expected: new OnboardPatientCommand({ name: 'John Doe' })
      },
      {
        description: 'should throw a validation error',
        payload: { name: '' },
        expectedError: 'Name must be a non-empty string'
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected, expectedError }) => {
      try {
        await controller.onboardPatient(payload)
        expect(commandBus.execute).toHaveBeenCalledWith(expected)

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

  describe('getPatientsMain', () => {
    const queryBus = new QueryBus({} as ModuleRef)
    queryBus.execute = jest.fn() as unknown as jest.Mocked<typeof queryBus.execute>
    const controller = new PatientController({} as CommandBus, queryBus)

    const testCases = [
      {
        description: 'should call query bus with GetUsersMain query',
        expected: new GetPatientsMain()
      }
    ]
    test.each(testCases)('$description', async ({ expected }) => {
      await controller.getPatientsMain()
      expect(queryBus.execute).toHaveBeenCalledWith(expected)
    })
  })

  describe('getPatientByIdMain', () => {
    const queryBus = new QueryBus({} as ModuleRef)
    queryBus.execute = jest.fn() as unknown as jest.Mocked<typeof queryBus.execute>
    const controller = new PatientController({} as CommandBus, queryBus)

    const testCases = [
      {
        description: 'should call query bus with GetUserByIdMain query',
        id: '1',
        expected: new GetPatientByIdMain('1')
      },
      {
        description: 'should throw a validation error',
        id: '',
        expectedError: 'ID must be a non-empty string'
      }
    ]
    test.each(testCases)('$description', async ({ id, expected, expectedError }) => {
      try {
        await controller.getPatientByIdMain(id)
        expect(queryBus.execute).toHaveBeenCalledWith(expected)

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
