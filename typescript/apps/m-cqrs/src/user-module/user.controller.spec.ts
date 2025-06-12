import { jest } from '@jest/globals'
import { UserController } from './user.controller.js'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateUserCommand, UpdateUserNameCommand, UserEnterTheSystemCommand, UserExitTheSystemCommand } from './commands/index.js'
import { ModuleRef } from '@nestjs/core/injector/module-ref.js'
import { GetUsersMain, GetUserByIdMain } from './queries/index.js'
import { UserMainRepository } from './projections/user-main.repository.js'

describe('UserController', () => {
  describe('createUser', () => {
    const commandBus = new CommandBus({} as ModuleRef)
    commandBus.execute = jest.fn() as jest.Mocked<typeof commandBus.execute>
    const controller = new UserController(commandBus, {} as QueryBus, {} as UserMainRepository)

    const testCases = [
      {
        description: 'should create CreateUserCommand',
        payload: { name: 'John Doe' },
        expected: new CreateUserCommand({ name: 'John Doe' })
      },
      {
        description: 'should throw a validation error',
        payload: { name: '' },
        expectedError: 'Name must be a non-empty string'
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected, expectedError }) => {
      try {
        await controller.createUser(payload)
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

  describe('updateUserName', () => {
    const commandBus = new CommandBus({} as ModuleRef)
    commandBus.execute = jest.fn() as jest.Mocked<typeof commandBus.execute>
    const controller = new UserController(commandBus, {} as QueryBus, {} as UserMainRepository)

    const testCases = [
      {
        description: 'should update the user`s name',
        payload: { id: '1231', name: 'new name' },
        expected: new UpdateUserNameCommand({ id: '1231', name: 'new name' })
      },
      {
        description: 'should throw an ID validation error',
        payload: { id: '', name: 'new name' },
        expectedError: 'ID must be a non-empty string'
      },
      {
        description: 'should throw a name validation error',
        payload: { id: '1231', name: '' },
        expectedError: 'Name must be a non-empty string'
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected, expectedError }) => {
      try {
        await controller.updateUserName(payload)
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

  describe('enterTheSystem', () => {
    const commandBus = new CommandBus({} as ModuleRef)
    commandBus.execute = jest.fn() as jest.Mocked<typeof commandBus.execute>
    const controller = new UserController(commandBus, {} as QueryBus, {} as UserMainRepository)

    const testCases = [
      {
        description: 'should enter the system',
        payload: { id: '1231' },
        expected: new UserEnterTheSystemCommand({ id: '1231' })
      },
      {
        description: 'should throw a validation error',
        payload: { id: '' },
        expectedError: 'ID must be a non-empty string'
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected, expectedError }) => {
      try {
        await controller.enterTheSystem(payload)
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

  describe('exitTheSystem', () => {
    const commandBus = new CommandBus({} as ModuleRef)
    commandBus.execute = jest.fn() as jest.Mocked<typeof commandBus.execute>
    const controller = new UserController(commandBus, {} as QueryBus, {} as UserMainRepository)

    const testCases = [
      {
        description: 'should exit the system',
        payload: { id: '1231' },
        expected: new UserExitTheSystemCommand({ id: '1231' })
      },
      {
        description: 'should throw a validation error',
        payload: { id: '' },
        expectedError: 'ID must be a non-empty string'
      }
    ]
    test.each(testCases)('$description', async ({ payload, expected, expectedError }) => {
      try {
        await controller.exitTheSystem(payload)
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

  describe('getUsersMain', () => {
    const queryBus = new QueryBus({} as ModuleRef)
    queryBus.execute = jest.fn() as unknown as jest.Mocked<typeof queryBus.execute>
    const controller = new UserController({} as CommandBus, queryBus, {} as UserMainRepository)

    const testCases = [
      {
        description: 'should call query bus with GetUsersMain query',
        expected: new GetUsersMain()
      }
    ]
    test.each(testCases)('$description', async ({ expected }) => {
      await controller.getUsersMain()
      expect(queryBus.execute).toHaveBeenCalledWith(expected)
    })
  })

  describe('getUserByIdMain', () => {
    const queryBus = new QueryBus({} as ModuleRef)
    queryBus.execute = jest.fn() as unknown as jest.Mocked<typeof queryBus.execute>
    const controller = new UserController({} as CommandBus, queryBus, {} as UserMainRepository)

    const testCases = [
      {
        description: 'should call query bus with GetUserByIdMain query',
        id: '1',
        expected: new GetUserByIdMain('1')
      },
      {
        description: 'should throw a validation error',
        id: '',
        expectedError: 'ID must be a non-empty string'
      }
    ]
    test.each(testCases)('$description', async ({ id, expected, expectedError }) => {
      try {
        await controller.getUserByIdMain(id)
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
