import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { InjectLogger, Logger } from '@CQRS-variations-test/logger'
import { User, UserUpdatePayload } from '../../types/user.js'

/**
 * Repository for managing main user data.
 *
 * @class UserMainRepository
 */
@Injectable()
export class UserMainRepository {
  constructor(
    @InjectConnection() readonly knexConnection: knex.Knex,
    @InjectLogger(UserMainRepository.name) readonly logger: Logger
  ) {}

  private tableName = 'users'

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

  async update(id: string, payload: UserUpdatePayload): Promise<boolean> {
    await this.knexConnection
      .table(this.tableName)
      .update({ ...payload })
      .where({ id })

    return true
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
