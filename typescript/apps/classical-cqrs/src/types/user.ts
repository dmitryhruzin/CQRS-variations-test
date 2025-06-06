import { AggregateMetadata, EventBasePayload } from './common.js'

/**
 * Type representing a user.
 * @typedef {Object} User
 * @property {string} id - The user's ID.
 * @property {string} name - The user's name.
 *
 * Represents a user with an ID and a name.
 */
export type User = {
  id: string
  name: string
  version?: number
}

export type UserUpdatePayload = {
  version: number
  name?: string
}

/**
 * Type representing the main user.
 * @typedef {Object} UserMain
 * @property {string} id - The user's ID.
 * @property {string} name - The user's name.
 *
 * Represents the main user with an ID and a name.
 */
export type UserMain = {
  id: string
  name: string
}

export type AggregateUserData = AggregateMetadata & User

/**
 * Type representing a user with an optional ID.
 * @typedef {Object} UserWithOptionalId
 * @property {string} [id] - The user's ID (optional).
 * @property {string} name - The user's name.
 *
 * Represents a user with a name and an optional ID.
 */
export type UserWithOptionalId = Omit<User, 'id'> & { id?: string }

export type UserCreatedV1EventPayload = EventBasePayload & User

export type UserNameUpdatedV1EventPayload = EventBasePayload & {
  previousName: string
  name: string
}

/**
 * Type representing a create user request.
 * @typedef {Object} CreateUserRequest
 * @property {string} name - The name of the user to create.
 *
 * Represents the data required to create a new user.
 */
export type CreateUserRequest = {
  name: string
}

export type UpdateUserNameRequest = {
  id: string
  name: string
}
