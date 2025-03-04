/**
 * Type representing an acknowledgement response.
 * @typedef {Object} AcknowledgementResponse
 * @property {string} status - The status of the response.
 *
 * Represents the response status for an acknowledgement.
 */
export type AcknowledgementResponse = {
  status: string
}

/**
 * Interface representing an event.
 * @interface Event
 * @property {string} constructor.name - The name of the event constructor.
 * @property {number} version - The version of the event.
 * @property {string} aggregateId - The ID of the aggregate associated with the event.
 * @property {number} aggregateVersion - The version of the aggregate associated with the event.
 * @property {function} toJson - A function to serialize the event to JSON.
 *
 * Represents a generic event structure with a method to serialize it to JSON.
 */
export type Event = {
  constructor: {
    name: string
  }
  version: number
  aggregateId: string
  aggregateVersion: number
  toJson(): { [key: string]: unknown } | string
}

/**
 * Type representing the base payload for an event.
 * @typedef {Object} EventBasePayload
 * @property {string} aggregateId - The ID of the aggregate associated with the event.
 * @property {number} aggregateVersion - The version of the aggregate associated with the event.
 *
 * Represents the base payload containing aggregate information for an event.
 */
export type EventBasePayload = {
  aggregateId: string
  aggregateVersion: number
}

/**
 * Type representing a stored event.
 * @typedef {Object} StoredEvent
 * @property {string} name - The name of the event.
 * @property {number} version - The version of the event.
 * @property {string} aggregateId - The ID of the aggregate associated with the event.
 * @property {number} aggregateVersion - The version of the aggregate associated with the event.
 * @property {Object<string, unknown>} body - The body of the event.
 *
 * Represents an event that has been stored in the event store.
 */
export type StoredEvent = {
  name: string
  version: number
  aggregateId: string
  aggregateVersion: number
  body: { [key: string]: unknown }
}

/**
 * Type representing aggregate metadata.
 * @typedef {Object} AggregateMetadata
 * @property {string} id - The ID of the aggregate.
 * @property {number} version - The version of the aggregate.
 *
 * Represents metadata associated with an aggregate.
 */
export type AggregateMetadata = {
  id: string
  version: number
}
