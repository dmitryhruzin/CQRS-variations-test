import { LoggerModule } from '@CQRS-variations-test/logger'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { PatientController } from './patient.controller.js'
import { CreateUserCommandHandler, UpdateUserNameCommandHandler } from './commandHandlers/index.js'
import { UserCreatedEventHandler, UserNameUpdatedEventHandler } from './eventHandlers/index.js'
import { PatientRepository } from './patient.repository.js'
import { PatientMainRepository } from './projections/patient-main.repository.js'
import { EventStoreModule } from '../event-store-module/event-store.module.js'
import { AggregateModule } from '../aggregate-module/aggregate.module.js'
import { GetUserByIdMainQueryHandler, GetUsersMainQueryHandler } from './queryHandlers/index.js'

export const commandHandlers = [CreateUserCommandHandler, UpdateUserNameCommandHandler]
export const queryHandlers = [GetUsersMainQueryHandler, GetUserByIdMainQueryHandler]
export const eventHandlers = [UserCreatedEventHandler, UserNameUpdatedEventHandler]

@Module({
  imports: [ConfigModule, LoggerModule, CqrsModule, EventStoreModule, AggregateModule],
  controllers: [PatientController],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers, PatientRepository, PatientMainRepository]
})
export class PatientModule {}
