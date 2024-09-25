import { JobEntity } from '@domain/entities/job/job.entity'
import { createMock } from '@golevelup/ts-jest'
import { RegisterJobErrorCommand } from '@application/commands/job/register-job-error.command'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { RegisterJobErrorCommandHandler } from '@application/command-handlers/job/register-job-error.command-handler'
import { JobErrorCannotBeRegisteredError } from '@domain/errors/job/job-error-cannot-be-registered.error'

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
        const jobEntity = createMock<JobEntity>()
        jobEntity.isCompleted.mockReturnValue(true)

        const command = RegisterJobErrorCommand.from({
          job: jobEntity,
          error: new Error('error'),
        })

        await expect(commandHandler.handle(command)).rejects.toThrow(JobErrorCannotBeRegisteredError)
      })
    })
    describe('AND the job is not completed', () => {
      it('THEN it should register the error and save the job', async () => {
        const jobEntity = createMock<JobEntity>()
        jobEntity.isCompleted.mockReturnValue(false)

        const command = RegisterJobErrorCommand.from({
          job: jobEntity,
          error: new Error('error'),
        })

        await commandHandler.handle(command)

        expect(jobEntity.failed).toHaveBeenCalledWith(command.error)
        expect(jobRepository.save).toHaveBeenCalledWith(jobEntity)
      })
    })
  })
})
