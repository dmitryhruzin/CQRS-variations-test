import { Controller, HttpCode, Post, Get, Body, Param } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { AcknowledgementResponse } from '../types/common.js'
import {
  CreateUserRequest,
  UpdateUserNameRequest,
  EnterTheSystemRequest,
  ExitTheSystemRequest,
  UserMain
} from '../types/user.js'
import {
  CreateUserCommand,
  UpdateUserNameCommand,
  UserEnterTheSystemCommand,
  UserExitTheSystemCommand
} from './commands/index.js'
import { GetUsersMain, GetUserByIdMain } from './queries/index.js'
import { UserMainRepository } from './projections/user-main.repository.js'

/**
 * Controller for managing user-related operations.
 *
 * @class UserController
 */
@Controller('/users')
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private userMainRepository: UserMainRepository
  ) {}

  /**
   * Endpoint for creating a new user.
   *
   * @param {CreateUserRequest} payload - The user creation request data.
   * @returns {Promise<AcknowledgementResponse>} Promise resolving to an acknowledgement response.
   */
  @Post('/create-user')
  @HttpCode(200)
  async createUser(@Body() payload: CreateUserRequest): Promise<AcknowledgementResponse> {
    if (!payload.name || payload.name.trim() === '') {
      throw new Error('Name must be a non-empty string')
    }

    const command = new CreateUserCommand(payload)
    return this.commandBus.execute(command)
  }

  @Post('/update-user-name')
  @HttpCode(200)
  async updateUserName(@Body() payload: UpdateUserNameRequest): Promise<AcknowledgementResponse> {
    if (!payload.id || payload.id.trim() === '') {
      throw new Error('ID must be a non-empty string')
    }
    if (!payload.name || payload.name.trim() === '') {
      throw new Error('Name must be a non-empty string')
    }

    const command = new UpdateUserNameCommand(payload)
    return this.commandBus.execute(command)
  }

  @Post('/enter')
  @HttpCode(200)
  async enterTheSystem(@Body() payload: EnterTheSystemRequest): Promise<AcknowledgementResponse> {
    if (!payload.id || payload.id.trim() === '') {
      throw new Error('ID must be a non-empty string')
    }

    const command = new UserEnterTheSystemCommand(payload)
    return this.commandBus.execute(command)
  }

  @Post('/exit')
  @HttpCode(200)
  async exitTheSystem(@Body() payload: ExitTheSystemRequest): Promise<AcknowledgementResponse> {
    if (!payload.id || payload.id.trim() === '') {
      throw new Error('ID must be a non-empty string')
    }

    const command = new UserExitTheSystemCommand(payload)
    return this.commandBus.execute(command)
  }

  /**
   * Endpoint for retrieving all main users.
   *
   * @returns {Promise<UserMain[]>} Promise resolving to an array of main users.
   */
  @Get('/main')
  async getUsersMain(): Promise<UserMain[]> {
    return this.queryBus.execute(new GetUsersMain())
  }

  /**
   * Endpoint for retrieving a main user by ID.
   *
   * @param {string} id - The user ID.
   * @returns {Promise<UserMain>} Promise resolving to the main user.
   */
  @Get('/main/:id')
  async getUserByIdMain(@Param('id') id: string): Promise<UserMain> {
    if (!id || id.trim() === '') {
      throw new Error('ID must be a non-empty string')
    }

    return this.queryBus.execute(new GetUserByIdMain(id))
  }

  @Post('/rebuild-user-main')
  @HttpCode(200)
  async rebuildUserMain(): Promise<AcknowledgementResponse> {
    this.userMainRepository.rebuild()

    return { status: 'OK. Process executed.' }
  }
}
