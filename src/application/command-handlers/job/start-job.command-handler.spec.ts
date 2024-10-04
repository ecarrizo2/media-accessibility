import { createMock } from '@golevelup/ts-jest'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { StartJobCommandHandler } from '@application/command-handlers/job/start-job.command-handler'
import { StartJobCommand } from '@application/commands/job/start-job.command'
import { JobCannotBeStartedError } from '@domain/errors/job/job-cannot-be-started.error'
import { createJobEntityMock } from '../../../../test/mocks/job.entity.mock'
import { JobStatus } from '@domain/enums/job/job.enum'

describe('StartJobCommandHandler', () => {
  let commandHandler: StartJobCommandHandler
  const jobRepository = createMock<JobRepository>()

  beforeEach(() => {
    commandHandler = new StartJobCommandHandler(jobRepository)
  })

  describe('WHEN handling the command', () => {
    describe('AND the job cannot be started', () => {
      it('THEN should throw an error', async () => {
        const job = createJobEntityMock({ status: JobStatus.Completed })
        const command = await StartJobCommand.from({ job })

        await expect(commandHandler.handle(command)).rejects.toThrow(JobCannotBeStartedError)
      })
    })

    describe('AND the job can be started', () => {
      it('THEN should start the job and save it', async () => {
        const job = createJobEntityMock({ status: JobStatus.Pending })
        const command = await StartJobCommand.from({ job })
        await commandHandler.handle(command)

        expect(jobRepository.save).toHaveBeenCalledWith(command.job)
      })
    })
  })
})
