import knex from 'knex'
import { afterAll, beforeEach, describe, expect, it } from '@jest/globals'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import supertest from 'supertest'
import { CqrsModule } from '@nestjs/cqrs'
import { KnexModule } from 'nest-knexjs'
import { LoggerModule } from '@CQRS-variations-test/logger'
import { EventStoreModule } from '../event-store-module/event-store.module.js'
import { PatientController } from './patient.controller.js'
import { PatientRepository } from './patient.repository.js'
import { PatientMainRepository } from './projections/patient-main.repository.js'
import { commandHandlers, eventHandlers, queryHandlers } from './patient.module.js'
import { AggregateModule } from '../aggregate-module/aggregate.module.js'
import { testConfig } from '../../knexfile.js'

describe('PatientController (e2e)', () => {
  const context = {
    patient: { id: '' }
  }

  let db: knex.Knex
  let app: INestApplication

  beforeAll(() => {
    db = knex(testConfig)
  })

  afterAll(async () => {
    await db.schema.dropTable('patients')
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
      controllers: [PatientController],
      providers: [...commandHandlers, ...queryHandlers, ...eventHandlers, PatientRepository, PatientMainRepository]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Patients /onboard-patient  (POST)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .post('/patients/onboard-patient')
      .send({ name: 'John Doe' })
      .expect(200)
      .then((response) => {
        expect(response.text).toEqual('Acknowledgement OK')
        done()
      })
      .catch((err) => done(err))
  })

  it('Patients /main (GET)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .get('/patients/main')
      .expect(200)
      .then((response) => {
        expect(response.body.length).toEqual(1)
        context.patient = response.body[0]
        done()
      })
      .catch((err) => done(err))
  })

  it('Patients /main/:id (GET)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .get(`/patients/main/${context.patient.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toEqual(context.patient.id)
        done()
      })
      .catch((err) => done(err))
  })
})
