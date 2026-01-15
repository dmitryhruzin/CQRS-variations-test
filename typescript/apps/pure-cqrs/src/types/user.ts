import { EventBasePayload, AggregateMetadata } from './common.js'

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
}

/**
 * Type representing user aggregate data.
 * @typedef {Object} AggregateUserData
 * @property {string} id - The user's ID.
 * @property {string} name - The user's name.
 * @property {number} version - The aggregate version.
 * @property {boolean} isDeleted - Indicates if the aggregate is deleted.
 *
 * Represents user data combined with aggregate metadata.
 */
export type AggregateUserData = User & AggregateMetadata

/**
 * Type representing the payload for updating a user.
 * @typedef {Object} UserUpdatePayload
 * @property {string} [name] - The new name for the user (optional).
 *
 * Represents the data that can be used to update a user.
 */
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

/**
 * Type representing a user with an optional ID.
 * @typedef {Object} UserWithOptionalId
 * @property {string} [id] - The user's ID (optional).
 * @property {string} name - The user's name.
 *
 * Represents a user with a name and an optional ID.
 */
export type UserWithOptionalId = Omit<User, 'id'> & { id?: string }

/**
 * Type representing the payload for a UserCreatedV1 event.
 * @typedef {Object} UserCreatedV1EventPayload
 * @property {string} id - The user's ID.
 * @property {string} name - The user's name.
 * @property {string} eventId - The event's ID.
 * @property {string} eventName - The event's name.
 * @property {number} eventVersion - The event's version.
 * @property {Date} occurredAt - The event's occurrence timestamp.
 *
 * Represents the payload for a UserCreatedV1 event, including user details and event metadata.
 */
export type UserCreatedV1EventPayload = EventBasePayload & User

/**
 * Type representing the payload for a UserNameUpdatedV1 event.
 * @typedef {Object} UserNameUpdatedV1EventPayload
 * @property {string} previousName - The user's previous name.
 * @property {string} name - The user's new name.
 * @property {string} eventId - The event's ID.
 * @property {string} eventName - The event's name.
 * @property {number} eventVersion - The event's version.
 * @property {Date} occurredAt - The event's occurrence timestamp.
 *
 * Represents the payload for a UserNameUpdatedV1 event, including the previous and new names, and event metadata.
 */
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

/**
 * Type representing an update user name request.
 * @typedef {Object} UpdateUserNameRequest
 * @property {string} id - The ID of the user to update.
 * @property {string} name - The new name for the user.
 *
 * Represents the data required to update a user's name.
 */
export type UpdateUserNameRequest = {
  id: string
  name: string
}
