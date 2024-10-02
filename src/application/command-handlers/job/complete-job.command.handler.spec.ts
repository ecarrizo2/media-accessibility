import { CompleteJobCommandHandler } from '@application/command-handlers/job/complete-job.command.handler'
import { createMock } from '@golevelup/ts-jest'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { CompleteJobCommand } from '@application/commands/job/complete-job.command'
import { createJobEntityMock } from '../../../../test/mocks/job.entity.mock'
import { JobStatus } from '@domain/enums/job/job.enum'

describe('CompleteJobCommandHandler', () => {
  let commandHandler: CompleteJobCommandHandler
  const jobRepository = createMock<JobRepository>()

  beforeEach(() => {
    commandHandler = new CompleteJobCommandHandler(jobRepository)
  })

  describe('WHEN handling the command', () => {
    it('THEN it should complete the job and save it', async () => {
      const job = createJobEntityMock()
      const command = await CompleteJobCommand.from({ job })

      await commandHandler.handle(command)

      expect(jobRepository.save).toHaveBeenCalledTimes(1)
      expect(jobRepository.save).toHaveBeenCalledWith({
        ...job,
        status: JobStatus.Completed,
      })
    })
  })
})
