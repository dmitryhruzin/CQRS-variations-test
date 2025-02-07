import { AggregateRoot } from '@nestjs/cqrs'

export class Aggregate extends AggregateRoot {
  id: string

  version: number = 0

  toJson(): object {
    return {}
  }
}
