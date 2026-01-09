import { UserEnteredTheSystem } from './UserEnteredTheSystem.js'

export class UserEnteredTheSystemV1 extends UserEnteredTheSystem {
  public version: number = 1

  public active: boolean = true

  toJson() {
    return {
      active: this.active
    }
  }
}
