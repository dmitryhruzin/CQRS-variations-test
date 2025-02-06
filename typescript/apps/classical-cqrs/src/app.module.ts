import { LoggerModule } from '@CQRS-variations-test/logger'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KnexModule } from 'nest-knexjs'
import { UserModule } from './user-module/user.module.js'
import { EventStoreModule } from './event-store-module/event-store.module.js'

/**
 * The main application module for configuring imports and middleware.
 *
 * @module AppModule
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(),
    EventStoreModule,
    UserModule,
    KnexModule.forRootAsync({
      useFactory: () => ({
        config: {
          client: 'sqlite3',
          useNullAsDefault: true,
          connection: {
            filename: './data.db'
          }
        }
      })
    })
  ]
})
export class AppModule implements NestModule {
  /**
   * Configures middleware for the application.
   *
   * @param {MiddlewareConsumer} consumer - The middleware consumer.
   *
   * This method allows for configuring middleware that will be applied to the application.
   */
  configure(consumer: MiddlewareConsumer) {
    console.log(consumer)
  }
}
