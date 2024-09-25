import { CompleteJobCommandHandler } from '@application/command-handlers/job/complete-job.command.handler'
import { createMock } from '@golevelup/ts-jest'
import { JobEntity } from '@domain/entities/job/job.entity'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { CompleteJobCommand } from '@application/commands/job/complete-job.command'

describe('CompleteJobCommandHandler', () => {
  let commandHandler: CompleteJobCommandHandler
  const jobRepository = createMock<JobRepository>()

  beforeEach(() => {
    commandHandler = new CompleteJobCommandHandler(jobRepository)
  })

  describe('WHEN handling the command', () => {
    it('THEN it should complete the job and save it', async () => {
      const job = createMock<JobEntity>()
      const command = CompleteJobCommand.from({ job })

      await commandHandler.handle(command)

      expect(job.complete).toHaveBeenCalled()
      expect(jobRepository.save).toHaveBeenCalledWith(job)
    })
  })
})
