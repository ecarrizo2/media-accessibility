import { createMock } from '@golevelup/ts-jest'
import { JobFacadeService } from '@application/services/job/job-facade.service'
import { CreateJobCommandHandler } from '@application/command-handlers/job/create-job.command-handler'
import { StartJobCommandHandler } from '@application/command-handlers/job/start-job.command-handler'
import { RegisterJobErrorCommandHandler } from '@application/command-handlers/job/register-job-error.command-handler'
import { GetJobByIdQueryHandler } from '@application/query-handlers/job/get-job-by-id.query-handler'
import { LoggerService } from '@shared/logger/logger.service'
import { JobType } from '@domain/enums/job/job.enum'
import { JobEntity } from '@domain/entities/job/job.entity'
import { CompleteJobCommandHandler } from '@application/command-handlers/job/complete-job.command.handler'
import { ClassValidatorError } from '@shared/errors/class-validator.error'
import { createJobEntityMock } from '../../../../test/mocks/job.entity.mock'
import { mockedUuid } from '../../../../jest.setup'
import { RegisterJobErrorCommand } from '@application/commands/job/register-job-error.command'
import { JobNotFoundError } from '@domain/errors/job/job-not-found.error'

describe('JobFacadeService', () => {
  const createJobCommandHandler = createMock<CreateJobCommandHandler>()
  const startJobCommandHandler = createMock<StartJobCommandHandler>()
  const completeJobHandler = createMock<CompleteJobCommandHandler>()
  const registerJobErrorHandler = createMock<RegisterJobErrorCommandHandler>()
  const getJobByIdQueryHandler = createMock<GetJobByIdQueryHandler>()
  const logger = createMock<LoggerService>()

  const jobEntity = new JobEntity()
  jobEntity.id = 'job-id'
  jobEntity.type = JobType.ImageProcessing

  const getInstance = () => {
    return new JobFacadeService(
      createJobCommandHandler,
      startJobCommandHandler,
      completeJobHandler,
      registerJobErrorHandler,
      getJobByIdQueryHandler,
      logger
    )
  }

  describe('create()', () => {
    describe('WHEN creating a job', () => {
      describe('AND the job creation succeeds', () => {
        beforeAll(() => {
          jest.spyOn(createJobCommandHandler, 'handle').mockResolvedValue(jobEntity)
        })

        afterAll(jest.resetAllMocks)

        it('THEN it should create a new job', async () => {
          const service = getInstance()
          const result = await service.create(JobType.ImageProcessing, { url: 'https://example.com/image.jpg' })

          expect(createJobCommandHandler.handle).toHaveBeenCalledTimes(1)
          expect(createJobCommandHandler.handle).toHaveBeenCalledWith(expect.anything())
          expect(result).toBe(jobEntity)
        })
      })

      describe('AND the CreateJobCommand dto creation fails', () => {
        let promise: Promise<JobEntity>
        beforeAll(() => {
          promise = getInstance().create('invalid' as JobType, {
            url: 'https://example.com/image.jpg',
          })
        })
        afterAll(jest.resetAllMocks)

        it('THEN it should throw an error', async () => {
          await expect(promise).rejects.toThrow(ClassValidatorError)
        })

        it('AND should have not attempted to handle the command', async () => {
          await promise.catch(() => {
            expect(createJobCommandHandler.handle).not.toHaveBeenCalled()
          })
        })
      })

      describe('AND the CreateJobCommandHandler throws', () => {
        const error = new Error('CreateJobCommandHandler handle failed')
        beforeAll(() => {
          jest.spyOn(createJobCommandHandler, 'handle').mockRejectedValue(error)
        })
        afterAll(jest.resetAllMocks)

        it('THEN it should throw an error', async () => {
          const promise = getInstance().create(JobType.ImageProcessing, { url: 'https://example.com/image.jpg' })

          await expect(promise).rejects.toThrow(error)
        })
      })
    })
  })

  describe('start()', () => {
    describe('WHEN starting a job', () => {
      afterEach(jest.resetAllMocks)
      describe('AND the job is not found', () => {
        it('THEN should throw a JobNotFound Error', async () => {
          const jobId = mockedUuid
          const job = null
          jest.spyOn(getJobByIdQueryHandler, 'execute').mockResolvedValue(job)

          const service = getInstance()
          await expect(service.start(jobId)).rejects.toThrow(JobNotFoundError)
        })
      })

      describe('AND the job start succeeds', () => {
        beforeAll(() => {
          jest.spyOn(startJobCommandHandler, 'handle').mockResolvedValue(void 8)
        })

        it('THEN it should start the job', async () => {
          const jobId = mockedUuid
          const job = createJobEntityMock()
          jest.spyOn(getJobByIdQueryHandler, 'execute').mockResolvedValue(job)

          const service = getInstance()
          const result = await service.start(jobId)

          expect(startJobCommandHandler.handle).toHaveBeenCalledTimes(1)
          expect(getJobByIdQueryHandler.execute).toHaveBeenCalledTimes(1)
          expect(getJobByIdQueryHandler.execute).toHaveBeenCalledWith({ jobId })
          expect(startJobCommandHandler.handle).toHaveBeenCalledWith({ job })
          expect(result).toBe(void 8)
        })
      })
    })
  })

  describe('failed()', () => {
    describe('WHEN job processing failed', () => {
      beforeAll(() => {
        jest.spyOn(registerJobErrorHandler, 'handle').mockResolvedValue(void 8)
      })

      afterAll(jest.resetAllMocks)

      it('THEN it should register the job handling failure', async () => {
        const jobId = mockedUuid
        const job = createJobEntityMock()
        const error = new Error('Error')
        const registerJobErrorCommand = await RegisterJobErrorCommand.from({ job, error })

        jest.spyOn(getJobByIdQueryHandler, 'execute').mockResolvedValue(job)

        const service = getInstance()
        const result = await service.failed(jobId, error)

        expect(registerJobErrorHandler.handle).toHaveBeenCalledTimes(1)
        expect(getJobByIdQueryHandler.execute).toHaveBeenCalledTimes(1)
        expect(getJobByIdQueryHandler.execute).toHaveBeenCalledWith({ jobId })
        expect(registerJobErrorHandler.handle).toHaveBeenCalledWith(registerJobErrorCommand)
        expect(result).toBe(void 8)
      })
    })
  })

  describe('complete()', () => {
    describe('WHEN job complete succeeds', () => {
      beforeAll(() => {
        jest.spyOn(completeJobHandler, 'handle').mockResolvedValue(void 8)
      })

      afterAll(jest.resetAllMocks)

      it('THEN it should register the job handling failure', async () => {
        const jobId = mockedUuid
        const job = createJobEntityMock()

        jest.spyOn(getJobByIdQueryHandler, 'execute').mockResolvedValue(job)

        const service = getInstance()
        const result = await service.complete(jobId)

        expect(getJobByIdQueryHandler.execute).toHaveBeenCalledTimes(1)
        expect(getJobByIdQueryHandler.execute).toHaveBeenCalledWith({ jobId })
        expect(completeJobHandler.handle).toHaveBeenCalledTimes(1)
        expect(completeJobHandler.handle).toHaveBeenCalledWith({ job })
        expect(result).toBe(void 8)
      })
    })
  })
})
