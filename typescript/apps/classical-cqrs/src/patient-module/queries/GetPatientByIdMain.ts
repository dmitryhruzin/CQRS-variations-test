/**
 * Represents a query to retrieve a patient by their ID.
 */
export class GetPatientByIdMain {
  /**
   * @param id - The ID of the patient to retrieve.
   */
  constructor(public readonly id: string) {}
}
