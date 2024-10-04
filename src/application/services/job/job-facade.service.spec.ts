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
        beforeAll(async () => {
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

        it('AND should have not attempted to handle the command', () => {
          expect(createJobCommandHandler.handle)
        })
      })

      describe('AND the CreateJobCommandHandler throws', () => {
        const error = new Error('Job creation failed')
        beforeAll(async () => {
          jest.spyOn(createJobCommandHandler, 'handle').mockRejectedValue(error)
        })
        afterAll(jest.resetAllMocks)

        it('THEN it should throw an error', async () => {
          const promise = getInstance().create(JobType.ImageProcessing, { url: 'https://example.com/image.jpg' })

          await expect(promise).rejects.toThrow(ClassValidatorError)
        })
      })
    })
  })
})
