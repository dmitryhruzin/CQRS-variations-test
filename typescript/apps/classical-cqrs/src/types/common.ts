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
  toJson(): { [key: string]: unknown }
}

export type EventBasePayload = {
  aggregateId: string
  aggregateVersion: number
}

/**
 * Type representing a stored event.
 * @typedef {Object} StoredEvent
 * @property {string} name - The name of the event.
 * @property {number} version - The version of the event.
 * @property {{ [key: string]: unknown }} body - The body of the event.
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

export type Snapshot<T> = null | {
  id: number
  aggregateId: string
  aggregateVersion: number
  state: T
}
