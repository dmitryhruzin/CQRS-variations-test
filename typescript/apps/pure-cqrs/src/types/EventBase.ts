import { Event, EventBasePayload } from './common.js'

export default class EventBase implements Event {
  public aggregateId: string

  public aggregateVersion: number

  constructor(payload: EventBasePayload) {
    this.aggregateId = payload.aggregateId
    this.aggregateVersion = payload.aggregateVersion
  }

  toJson(): { [key: string]: unknown } {
    // Custom implementation for each event
    return {}
  }
}
