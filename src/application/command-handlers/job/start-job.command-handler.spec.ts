import { createMock } from '@golevelup/ts-jest'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { StartJobCommandHandler } from '@application/command-handlers/job/start-job.command-handler'
import { JobEntity } from '@domain/entities/job/job.entity'
import { StartJobCommand } from '@application/commands/job/start-job.command'
import { JobCannotBeStartedError } from '@domain/errors/job/job-cannot-be-started.error'

describe('StartJobCommandHandler', () => {
  let commandHandler: StartJobCommandHandler
  const jobRepository = createMock<JobRepository>()

  beforeEach(() => {
    commandHandler = new StartJobCommandHandler(jobRepository)
  })

  describe('WHEN handling the command', () => {
    describe('AND the job cannot be started', () => {
      it('THEN should throw an error', async () => {
        const job = createMock<JobEntity>()
        job.canStart.mockReturnValue(false)

        const command = StartJobCommand.from({ job })
        await expect(commandHandler.handle(command)).rejects.toThrow(JobCannotBeStartedError)
      })
    })

    describe('AND the job can be started', () => {
      it('THEN should start the job and save it', async () => {
        const job = createMock<JobEntity>()
        job.canStart.mockReturnValue(true)

        const command = StartJobCommand.from({ job })
        await commandHandler.handle(command)

        expect(job.start).toHaveBeenCalled()
        expect(jobRepository.save).toHaveBeenCalledWith(job)
      })
    })
  })
})
