import { UserExitedTheSystem } from './UserExitedTheSystem.js'

export class UserExitedTheSystemV1 extends UserExitedTheSystem {
  public version: number = 1

  public active: boolean = false

  toJson() {
    return {
      active: this.active
    }
  }
}
