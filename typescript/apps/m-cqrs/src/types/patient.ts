import { EventBasePayload, AggregateMetadata } from './common.js'

/**
 * Type representing a patient.
 * @typedef {Object} Patient
 * @property {string} id - The patient's ID.
 * @property {string} name - The patient's name.
 * @property {string[]} madicalHistory - The patient's medical history.
 *
 * Represents a patient with an ID, name, and medical history.
 */
export type Patient = {
  id: string
  name: string
  madicalHistory: string[]
}

/**
 * Type representing aggregate patient data.
 * @typedef {Object} AggregatePatientData
 * @property {string} id - The patient's ID.
 * @property {string} name - The patient's name.
 * @property {string[]} madicalHistory - The patient's medical history.
 * @property {number} version - The aggregate version.
 * @property {boolean} isDeleted - Indicates if the aggregate is deleted.
 *
 * Represents patient data combined with aggregate metadata.
 */
export type AggregatePatientData = Patient & AggregateMetadata

/**
 * Type representing a patient update payload.
 * @typedef {Object} PatientUpdatePayload
 * @property {string} [name] - The patient's name.
 * @property {string[]} [madicalHistory] - The patient's medical history.
 *
 * Represents the payload for updating a patient.
 */
export type PatientUpdatePayload = {
  name?: string
  madicalHistory?: string[]
}

/**
 * Type representing the main patient information.
 * @typedef {Object} PatientMain
 * @property {string} id - The patient's ID.
 * @property {string} name - The patient's name.
 *
 * Represents the main information of a patient (ID and name).
 */
export type PatientMain = {
  id: string
  name: string
}

/**
 * Type representing the payload for a PatientOnboardedV1 event.
 * @typedef {Object} PatientOnboardedV1EventPayload
 * @property {string} eventId - The event ID.
 * @property {string} eventName - The event name.
 * @property {number} eventVersion - The event version.
 * @property {string} eventTimestamp - The event timestamp.
 * @property {string} name - The patient's name.
 * @property {string[]} madicalHistory - The patient's medical history.
 * @property {string} [id] - The patient's ID.
 *
 * Represents the payload for the PatientOnboardedV1 event.
 */
export type PatientOnboardedV1EventPayload = EventBasePayload & Omit<Patient, 'id'> & { id?: string }

/**
 * Type representing the payload for a SurgeryAddedV1 event.
 * @typedef {Object} SurgeryAddedV1EventPayload
 * @property {string} eventId - The event ID.
 * @property {string} eventName - The event name.
 * @property {number} eventVersion - The event version.
 * @property {string} eventTimestamp - The event timestamp.
 * @property {string} previousName - The previous name of the surgery.
 * @property {string} name - The name of the surgery.
 *
 * Represents the payload for the SurgeryAddedV1 event.
 */
export type SurgeryAddedV1EventPayload = EventBasePayload & {
  previousName: string
  name: string
}

/**
 * Type representing the request to onboard a patient.
 * @typedef {Object} OnboardPatientRequest
 * @property {string} name - The patient's name.
 *
 * Represents the request to onboard a patient.
 */
export type OnboardPatientRequest = {
  name: string
}

/**
 * Type representing the request to add a surgery.
 * @typedef {Object} AddSurgeryRequest
 * @property {string} patientId - The patient's ID.
 * @property {Object} surgery - The surgery details.
 * @property {string} surgery.label - The surgery label.
 * @property {string} surgery.doctorName - The doctor's name.
 *
 * Represents the request to add a surgery.
 */
export type AddSurgeryRequest = {
  patientId: string
  surgery: {
    label: string
    doctorName: string
  }
}
