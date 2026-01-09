import { Injectable } from '@nestjs/common'
import { Event, StoredEvent } from '../types/common.js'
import { UserAggregate } from './user.aggregate.js'
import { UserCreated, UserNameUpdated } from './events/index.js'
import { EventStoreRepository } from '../event-store-module/event-store.repository.js'
import { UserCreatedEventPayload, UserNameUpdatedEventPayload } from '../types/user.js'

/**
 * Repository for managing user aggregates.
 *
 * @class UserRepository
 */
@Injectable()
export class UserRepository {
  private cache: { [key: string]: UserAggregate } = {}

  // @ts-ignore
  constructor(private readonly eventStore: EventStoreRepository) {}

  /**
   * Builds a user aggregate by ID.
   *
   * @param {string} [id] - The user ID (optional).
   * @returns {Promise<UserAggregate>} Promise resolving to the user aggregate.
   */
  async buildUserAggregate(id?: string): Promise<UserAggregate> {
    if (!id) {
      return new UserAggregate()
    }

    const agg = this.cache[id] || new UserAggregate()
    const events = await this.eventStore.getEventsByAggregateId(id, agg.version || 0)
    const aggregate: UserAggregate = events.reduce(this.replayEvent, agg)

    this.cache[id] = aggregate

    return aggregate
  }

  replayEvent(agg: UserAggregate, event: StoredEvent) {
    const eventPayload = {
      ...event.body,
      aggregateId: agg.id,
      aggregateVersion: event.aggregateVersion
    }
    if (event.name === 'UserCreated') {
      agg.replayUserCreated(new UserCreated(eventPayload as UserCreatedEventPayload))
    } else if (event.name === 'UserNameUpdated') {
      agg.replayUserNameUpdated(new UserNameUpdated(eventPayload as UserNameUpdatedEventPayload))
    } else {
      throw new Error(`User aggregate replay. Unprocesible event ${event.name}`)
    }
    return agg
  }

  /**
   * Saves the user aggregate and events to the event store.
   *
   * @param {UserAggregate} aggregate - The user aggregate.
   * @param {Event[]} events - The events to save.
   * @returns {Promise<boolean>} Promise resolving to a boolean indicating success.
   */
  async save(aggregate: UserAggregate, events: Event[]): Promise<boolean> {
    const aggregateId = aggregate.toJson().id

    await this.eventStore.saveEvents(aggregateId, events)

    this.cache[aggregateId] = aggregate

    return true
  }
}
