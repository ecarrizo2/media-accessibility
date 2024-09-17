import { inject, injectable } from 'tsyringe'
import { DynamodbJobRepository } from '@infrastructure/repositories/job/dynamodb-job.repository'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { StartJobCommand } from '@application/commands/job/start-job.command'
import { JobStatus } from '@domain/enums/job/job.enum'
import { JobEntity } from '@domain/entities/job/job.entity'
import { BaseJobCommandHandler } from '@application/command-handlers/job/base-job.command-handler'

@injectable()
export class CompleteJobCommandHandler extends BaseJobCommandHandler {
  constructor(@inject(DynamodbJobRepository) jobRepository: JobRepository) {
    super(jobRepository)
  }

  async handle(command: StartJobCommand): Promise<void> {
    const job = await this.getJobFromDatabase(command.jobId)
    job.complete()
    await this.jobRepository.save(job)
  }
}
