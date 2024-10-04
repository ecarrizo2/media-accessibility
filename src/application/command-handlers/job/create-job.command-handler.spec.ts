import { CreateJobCommandHandler } from '@application/command-handlers/job/create-job.command-handler'
import { createMock } from '@golevelup/ts-jest'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { CreateJobCommand } from '@application/commands/job/create-job.command'
import { JobStatus, JobType } from '@domain/enums/job/job.enum'
import { JobEntity } from '@domain/entities/job/job.entity'

describe('CompleteJobCommandHandler', () => {
  let commandHandler: CreateJobCommandHandler
  const jobRepository = createMock<JobRepository>()

  beforeEach(() => {
    commandHandler = new CreateJobCommandHandler(jobRepository)
  })

  describe('WHEN handling the command', () => {
    it('THEN it should complete the job and save it', async () => {
      const command = await CreateJobCommand.from({
        type: JobType.ImageProcessing,
        input: { url: 'https://google.com/1', prompt: 'string' },
      })

      const unitResult = await commandHandler.handle(command)

      expect(jobRepository.save).toHaveBeenCalledTimes(1)
      expect(jobRepository.save).toHaveBeenCalledWith(expect.any(JobEntity))
      expect(unitResult).toBeInstanceOf(JobEntity)
      expect(unitResult).toEqual(
        expect.objectContaining({
          type: command.type,
          status: JobStatus.Pending,
          input: command.input,
          attempts: 0,
          errors: null,
        })
      )
    })
  })
})
