import { Injectable } from '@nestjs/common'
import { Event, StoredEvent } from '../types/common.js'
import { UserAggregate } from './user.aggregate.js'
import { UserCreatedV1, UserNameUpdatedV1 } from './events/index.js'
import { EventStoreRepository } from '../event-store-module/event-store.repository.js'
import { AggregateSnapshotRepository } from '../aggregate-module/aggregate-snapshot.repository.js'
import { UserCreatedV1EventPayload, UserNameUpdatedV1EventPayload } from '../types/user.js'

/**
 * Repository for managing user aggregates.
 *
 * @class UserRepository
 */
@Injectable()
export class UserRepository {
  private cache: { [key: string]: UserAggregate } = {}

  // @ts-ignore
  constructor(
    private readonly eventStore: EventStoreRepository,
    private readonly snapshotRepository: AggregateSnapshotRepository
  ) {}

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

    if (this.cache[id]) {
      const agg = this.cache[id]

      const events = await this.eventStore.getEventsByAggregateId(id, agg.version || 0)

      const aggregate: UserAggregate = events.reduce(this.replayEvent, agg)

      this.cache[id] = aggregate

      return aggregate
    }

    const snapshot = await this.snapshotRepository.getLatestSnapshotByAggregateId<UserAggregate>(id)

    const events = await this.eventStore.getEventsByAggregateId(id, snapshot?.aggregateVersion || 0)

    const aggregate: UserAggregate = events.reduce(this.replayEvent, new UserAggregate(snapshot))

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
      if (event.version === 1) {
        agg.replayUserCreatedV1(new UserCreatedV1(eventPayload as UserCreatedV1EventPayload))
      } else {
        throw new Error(`UserCreated replay. Unprocesible event version ${event.version}`)
      }
    } else if (event.name === 'UserNameUpdated') {
      if (event.version === 1) {
        agg.replayUserNameUpdatedV1(new UserNameUpdatedV1(eventPayload as UserNameUpdatedV1EventPayload))
      } else {
        throw new Error(`UserNameUpdated replay. Unprocesible event version ${event.version}`)
      }
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

    if ((aggregate.version + events.length) % 5 === 0) {
      const lastAggregate = events.reduce(
        (agg, e) =>
          this.replayEvent(aggregate, {
            body: e,
            aggregateId,
            aggregateVersion: agg.version,
            version: e.version,
            name: Object.getPrototypeOf(e.constructor).name
          }),
        aggregate
      )
      this.snapshotRepository.saveSnapshot(lastAggregate)
    }

    this.cache[aggregateId] = aggregate

    return true
  }
}
