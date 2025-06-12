import { LoggerModule } from '@CQRS-variations-test/logger'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { UserController } from './user.controller.js'
import {
  CreateUserCommandHandler,
  UpdateUserNameCommandHandler,
  UserEnterTheSystemCommandHandler,
  UserExitTheSystemCommandHandler
} from './commandHandlers/index.js'
import {
  UserCreatedEventHandler,
  UserNameUpdatedEventHandler,
  UserEnteredTheSystemEventHandler,
  UserExitedTheSystemEventHandler
} from './eventHandlers/index.js'
import { UserRepository } from './user.repository.js'
import { UserMainRepository } from './projections/user-main.repository.js'
import { EventStoreModule } from '../event-store-module/event-store.module.js'
import { AggregateModule } from '../aggregate-module/aggregate.module.js'
import { GetUserByIdMainQueryHandler, GetUsersMainQueryHandler } from './queryHandlers/index.js'

export const commandHandlers = [
  CreateUserCommandHandler,
  UpdateUserNameCommandHandler,
  UserEnterTheSystemCommandHandler,
  UserExitTheSystemCommandHandler
]
export const queryHandlers = [GetUsersMainQueryHandler, GetUserByIdMainQueryHandler]
export const userEventHandlers = [
  UserCreatedEventHandler,
  UserNameUpdatedEventHandler,
  UserEnteredTheSystemEventHandler,
  UserExitedTheSystemEventHandler
]

/**
 * Module for managing user-related functionalities.
 *
 * @class UserModule
 */
@Module({
  imports: [ConfigModule, LoggerModule, CqrsModule, EventStoreModule, AggregateModule],
  controllers: [UserController],
  providers: [...commandHandlers, ...queryHandlers, ...userEventHandlers, UserRepository, UserMainRepository]
})
export class UserModule {}
