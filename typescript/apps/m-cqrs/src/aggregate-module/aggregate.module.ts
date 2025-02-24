import { LoggerModule } from '@CQRS-variations-test/logger'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Aggregate } from './aggregate.js'

/**
 * Module for managing event store related dependencies and providers.
 *
 * @module EventStoreModule
 */
@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [Aggregate],
  exports: [Aggregate]
})
export class AggregateModule {}
