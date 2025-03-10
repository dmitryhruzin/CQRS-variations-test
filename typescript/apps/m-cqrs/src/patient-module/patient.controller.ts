import { Controller, HttpCode, Post, Get, Body, Param } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { AcknowledgementResponse } from '../types/common.js'
import { OnboardPatientRequest, AddSurgeryRequest, PatientMain } from '../types/patient.js'
import { OnboardPatientCommand, AddSurgeryCommand } from './commands/index.js'
import { GetPatientsMain, GetPatientByIdMain } from './queries/index.js'

/**
 * PatientController handles patient-related operations.
 */
@Controller('/patients')
export class PatientController {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Onboards a new patient.
   * @param payload - The patient onboarding request.
   * @returns Acknowledgment response.
   * @throws Error if the patient name is empty.
   */
  @Post('/onboard-patient')
  @HttpCode(200)
  async onboardPatient(@Body() payload: OnboardPatientRequest): Promise<AcknowledgementResponse> {
    if (!payload.name || payload.name.trim() === '') {
      throw new Error('Name must be a non-empty string')
    }

    const command = new OnboardPatientCommand(payload)
    return this.commandBus.execute(command)
  }

  /**
   * Adds a surgery to a patient.
   * @param payload - The add surgery request.
   * @returns Acknowledgment response.
   * @throws Error if the surgery name is empty.
   */
  @Post('/add-surgery')
  @HttpCode(200)
  async addSurgery(@Body() payload: AddSurgeryRequest): Promise<AcknowledgementResponse> {
    if (!payload.patientId || payload.patientId.trim() === '') {
      throw new Error('Patient ID must be a non-empty string')
    }

    if (!payload.surgery.label || payload.surgery.label.trim() === '') {
      throw new Error('Label must be a non-empty string')
    }

    if (!payload.surgery.doctorName || payload.surgery.doctorName.trim() === '') {
      throw new Error('Doctor name must be a non-empty string')
    }

    const command = new AddSurgeryCommand(payload)
    return this.commandBus.execute(command)
  }

  /**
   * Retrieves the main patient list.
   * @returns An array of PatientMain objects.
   */
  @Get('/main')
  async getPatientsMain(): Promise<PatientMain[]> {
    return this.queryBus.execute(new GetPatientsMain())
  }

  /**
   * Retrieves a patient by ID.
   * @param id - The ID of the patient to retrieve.
   * @returns The PatientMain object.
   * @throws Error if the ID is empty.
   */
  @Get('/main/:id')
  async getPatientByIdMain(@Param('id') id: string): Promise<PatientMain> {
    if (!id || id.trim() === '') {
      throw new Error('ID must be a non-empty string')
    }

    return this.queryBus.execute(new GetPatientByIdMain(id))
  }
}
