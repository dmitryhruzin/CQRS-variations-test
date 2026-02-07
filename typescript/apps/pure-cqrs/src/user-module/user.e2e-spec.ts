import { afterAll, beforeEach, describe, expect, it } from '@jest/globals'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import supertest from 'supertest'
import { CqrsModule } from '@nestjs/cqrs'
import knex from 'knex'
import { LoggerModule } from '@CQRS-variations-test/logger'
import { testConfig } from '../../knexfile.js'
import { EventStoreModule } from '../event-store-module/event-store.module.js'
import { KnexModule } from 'nest-knexjs'
import { UserController } from './user.controller.js'
import { UserRepository } from './user.repository.js'
import { UserMainRepository } from './projections/user-main.repository.js'
import { commandHandlers, userEventHandlers, queryHandlers } from './user.module.js'
import { AggregateModule } from '../aggregate-module/aggregate.module.js'

describe('UserController (e2e)', () => {
  const context = {
    user: { id: '' }
  }

  let db: knex.Knex
  let app: INestApplication

  beforeAll(() => {
    db = knex(testConfig)
  })

  afterAll(async () => {
    await db.schema.dropTable('users')
    await db.destroy()
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        LoggerModule.forRoot(),
        CqrsModule,
        EventStoreModule,
        AggregateModule,
        KnexModule.forRootAsync({
          useFactory: () => ({
            config: testConfig
          })
        })
      ],
      controllers: [UserController],
      providers: [...commandHandlers, ...queryHandlers, ...userEventHandlers, UserRepository, UserMainRepository]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Users /create-user (POST)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .post('/users/create-user')
      .send({ name: 'John Doe' })
      .expect(200)
      .then((response) => {
        expect(response.text).toEqual('Acknowledgement OK')
        done()
      })
      .catch((err) => done(err))
  })

  it('Users /main (GET)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .get('/users/main')
      .expect(200)
      .then((response) => {
        expect(response.body.length).toEqual(1)
        context.user = response.body[0]
        done()
      })
      .catch((err) => done(err))
  })

  it('Users /main/:id (GET)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .get(`/users/main/${context.user.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toEqual(context.user.id)
        done()
      })
      .catch((err) => done(err))
  })
})
