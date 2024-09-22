import { inject, injectable } from 'tsyringe'
import { DynamodbJobRepository } from '@infrastructure/repositories/job/dynamodb-job.repository'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { StartJobCommand } from '@application/commands/job/start-job.command'
import { JobCannotBeStartedError } from '@domain/errors/job/job-cannot-be-started.error'

@injectable()
export class StartJobCommandHandler {
  constructor(
    @inject(DynamodbJobRepository) private readonly jobRepository: JobRepository,
  ) {
  }

  /**
   * Handles the StartJobCommand by retrieving the job from the database,
   * checking if it can be started, and then starting the job.
   *
   * @param {StartJobCommand} command - The command containing the job ID to start.
   * @returns {Promise<void>} - A promise that resolves when the job has been started and saved.
   * @throws {JobCannotBeStartedError} - If the job cannot be started due to its current status.
   */
  async handle(command: StartJobCommand): Promise<void> {
    const { job } = command
    if (!job.canStart()) {
      throw new JobCannotBeStartedError(job.status)
    }

    job.start()
    await this.jobRepository.save(job)
  }
}
