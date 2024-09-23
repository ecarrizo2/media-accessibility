import { inject, injectable } from 'tsyringe'
import { DynamodbJobRepository } from '@infrastructure/repositories/job/dynamodb-job.repository'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { JobEntity } from '@domain/entities/job/job.entity'
import { RegisterJobErrorCommand } from '@application/commands/job/register-job-error.command'
import { BaseJobCommandHandler } from '@application/command-handlers/job/base-job.command-handler'
import { JobErrorCannotBeRegisteredError } from '@domain/errors/job/job-error-cannot-be-registered.error'

@injectable()
export class RegisterJobErrorCommandHandler extends BaseJobCommandHandler {
  constructor(@inject(DynamodbJobRepository) jobRepository: JobRepository) {
    super(jobRepository)
  }

  async handle(command: RegisterJobErrorCommand): Promise<void> {
    const job = await this.getJobFromDatabase(command.jobId)
    const error = command.error as Error

    this.checkJobErrorCanBeRegistered(job)
    job.failed(error)

    return this.jobRepository.save(job)
  }

  private checkJobErrorCanBeRegistered(job: JobEntity) {
    if (job.isCompleted()) {
      throw new JobErrorCannotBeRegisteredError('Job is already completed')
    }
  }
}
