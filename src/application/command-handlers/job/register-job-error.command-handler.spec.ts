import { JobEntity } from '@domain/entities/job/job.entity'
import { createMock } from '@golevelup/ts-jest'
import { RegisterJobErrorCommand } from '@application/commands/job/register-job-error.command'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { RegisterJobErrorCommandHandler } from '@application/command-handlers/job/register-job-error.command-handler'
import { JobErrorCannotBeRegisteredError } from '@domain/errors/job/job-error-cannot-be-registered.error'
import { createJobEntityMock } from '../../../../test/mocks/job.entity.mock'
import { JobStatus } from '@domain/enums/job/job.enum'

describe('RegisterJobErrorCommandHandler', () => {
  let commandHandler: RegisterJobErrorCommandHandler
  const jobRepository = createMock<JobRepository>()

  beforeEach(() => {
    commandHandler = new RegisterJobErrorCommandHandler(jobRepository)
  })

  afterEach(jest.resetAllMocks)

  describe('WHEN handling the command', () => {
    describe('AND the job is already completed', () => {
      it('THEN it should throw an error', async () => {
        const jobEntity = createJobEntityMock({
          status: JobStatus.Completed,
        })

        const command = await RegisterJobErrorCommand.from({
          job: jobEntity,
          error: new Error('error'),
        })

        await expect(commandHandler.handle(command)).rejects.toThrow(JobErrorCannotBeRegisteredError)
      })
    })
    describe('AND the job is not completed', () => {
      it('THEN it should register the error and save the job', async () => {
        const jobEntity = createJobEntityMock({
          status: JobStatus.InProgress,
        })

        const command = await RegisterJobErrorCommand.from({
          job: jobEntity,
          error: new Error('error'),
        })

        await commandHandler.handle(command)

        expect(jobRepository.save).toHaveBeenCalledWith(jobEntity)
      })
    })
  })
})
