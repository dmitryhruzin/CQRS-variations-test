import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { InjectLogger, Logger } from '@CQRS-variations-test/logger'
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
}
