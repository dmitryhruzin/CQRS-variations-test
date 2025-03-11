import { Injectable } from '@nestjs/common'
import { Event, StoredEvent } from '../types/common.js'
import { PatientAggregate } from './patient.aggregate.js'
import { PatientOnboardedV1, SurgeryAddedV1 } from './events/index.js'
import { EventStoreRepository } from '../event-store-module/event-store.repository.js'
import { AggregateSnapshotRepository } from '../aggregate-module/aggregate-snapshot.repository.js'
import { PatientOnboardedV1EventPayload, SurgeryAddedV1EventPayload } from '../types/patient.js'

@Injectable()
export class PatientRepository {
  private cache: { [key: string]: PatientAggregate } = {}

  constructor(
    private readonly eventStore: EventStoreRepository,
    private readonly snapshotRepository: AggregateSnapshotRepository
  ) {}

  async buildAggregate(id?: string): Promise<PatientAggregate> {
    if (!id) {
      return new PatientAggregate()
    }

    if (this.cache[id]) {
      const agg = this.cache[id]

      const events = await this.eventStore.getEventsByAggregateId(id, agg.version || 0)

      const aggregate: PatientAggregate = events.reduce(this.replayEvent, agg)

      this.cache[id] = aggregate

      return aggregate
    }

    const snapshot = await this.snapshotRepository.getLatestSnapshotByAggregateId<PatientAggregate>(id)

    const events = await this.eventStore.getEventsByAggregateId(id, snapshot?.aggregateVersion || 0)

    const aggregate: PatientAggregate = events.reduce(this.replayEvent, new PatientAggregate(snapshot))

    this.cache[id] = aggregate

    return aggregate
  }

  replayEvent(agg: PatientAggregate, event: StoredEvent) {
    const eventPayload = {
      ...event.body,
      aggregateId: agg.id,
      aggregateVersion: event.aggregateVersion
    }
    if (event.name === 'PatientOnboarded') {
      if (event.version === 1) {
        agg.replayPatientOnboardedV1(new PatientOnboardedV1(eventPayload as PatientOnboardedV1EventPayload))
      } else {
        throw new Error(`PatientOnboarded replay. Unprocesible event version ${event.version}`)
      }
    } else if (event.name === 'SurgeryAdded') {
      if (event.version === 1) {
        agg.replaySurgeryAddedV1(new SurgeryAddedV1(eventPayload as SurgeryAddedV1EventPayload))
      } else {
        throw new Error(`SurgeryAdded replay. Unprocesible event version ${event.version}`)
      }
    } else {
      throw new Error(`Patient aggregate replay. Unprocesible event ${event.name}`)
    }
    return agg
  }

  async save(aggregate: PatientAggregate, events: Event[]): Promise<boolean> {
    const aggregateId = aggregate.toJson().id

    await this.eventStore.saveEvents(aggregateId, events)

    if ((aggregate.version + events.length) % 50 === 0) {
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
