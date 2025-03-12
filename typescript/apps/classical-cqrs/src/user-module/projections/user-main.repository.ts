import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { InjectLogger, Logger } from '@CQRS-variations-test/logger'
import { EventStoreRepository } from '../../event-store-module/event-store.repository.js'
import { User, UserUpdatePayload } from '../../types/user.js'
import { VersionMismatchError } from '../../types/common.js'

/**
 * Repository for managing main user data.
 *
 * @class UserMainRepository
 */
@Injectable()
export class UserMainRepository {
  private tableName: string = 'users'

  // @ts-ignore
  constructor(
    private readonly eventStore: EventStoreRepository,
    @InjectConnection() private readonly knexConnection: knex.Knex,
    @InjectLogger(UserMainRepository.name) private readonly logger: Logger
  ) {}

  /**
   * Initializes the module by creating the users table if it doesn't exist.
   */
  async onModuleInit() {
    if (!(await this.knexConnection.schema.hasTable(this.tableName))) {
      await this.knexConnection.schema.createTable(this.tableName, (table) => {
        table.string('id').primary()
        table.string('name')
        table.integer('version')
      })
    }
  }

  /**
   * Saves a user record to the database.
   *
   * @param {User} record - The user record to save.
   * @returns {Promise<boolean>} Promise resolving to a boolean indicating success.
   */
  async save(record: User): Promise<boolean> {
    await this.knexConnection.table(this.tableName).insert([{ ...record, version: 1 }])

    return true
  }

  async update(id: string, payload: UserUpdatePayload, tryCounter = 0): Promise<boolean> {
    const trx = await this.knexConnection.transaction()
    try {
      const user = await this.knexConnection.table(this.tableName).transacting(trx).forUpdate().where({ id }).first()
      if (!user || user.version + 1 !== payload.version) {
        throw new VersionMismatchError(
          `Version mismatch for User with id: ${id}, current version: ${user?.version}, new version: ${payload.version}`
        )
      }
      await this.knexConnection
        .table(this.tableName)
        .transacting(trx)
        .update({ ...payload })
        .where({ id })
      await trx.commit()

      return true
    } catch (e) {
      if (e instanceof VersionMismatchError) {
        if (tryCounter < 3) {
          setTimeout(() => this.update(id, payload, tryCounter + 1), 1000)
        } else {
          this.logger.warn(e)
        }
        return true
      }
      throw e
    } finally {
      await trx.rollback()
    }
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns {Promise<User[]>} Promise resolving to an array of users.
   */
  async getAll(): Promise<User[]> {
    return this.knexConnection.table(this.tableName)
  }

  /**
   * Retrieves a user by ID from the database.
   *
   * @param {string} id - The user ID.
   * @returns {Promise<User>} Promise resolving to the user.
   * @throws {Error} If the user is not found.
   */
  async getById(id: string): Promise<User> {
    const user = await this.knexConnection.table(this.tableName).where({ id }).first()

    if (!user) {
      throw new Error(`User with id: ${id} not found`)
    }

    return user
  }

  async rebuild() {
    const eventNames = ['UserCreated', 'UserNameUpdated']

    await this.knexConnection.table(this.tableName).del()

    let events = await this.eventStore.getEventsByName(eventNames, 0)
    while (events.length > 0) {
      for (let i = 0; i < events.length; i += 1) {
        switch (events[i].name) {
          case 'UserCreated': {
            const { id, name } = events[i].body as { id: string; name: string }
            if (!id || !name) {
              this.logger.warn(`event with id: ${events[i].id} is missing id or name`)
              break
            }
            // eslint-disable-next-line no-await-in-loop
            await this.save({ id, name })
            break
          }
          case 'UserNameUpdated': {
            const { name } = events[i].body as { name: string }
            if (!name) {
              this.logger.warn(`event with id: ${events[i].id} is missing name`)
              break
            }
            // eslint-disable-next-line no-await-in-loop
            await this.update(events[i].aggregateId, {
              name,
              version: events[i].aggregateVersion
            })
            break
          }
          default: {
            break
          }
        }
      }
      this.logger.info(`Applied events from ${events[0].id} to ${events[events.length - 1].id}`)

      // eslint-disable-next-line no-await-in-loop
      events = await this.eventStore.getEventsByName(eventNames, events[events.length - 1].id)
    }

    this.logger.info('Rebuild projection finished')
    return 0
  }
}
