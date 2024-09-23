import { inject, injectable } from 'tsyringe'
import { DynamodbJobRepository } from '@infrastructure/repositories/dynamodb-job.repository'
import { JobRepository } from '@domain/repositories/job-repository.interface'
import { StartJobCommand } from '@application/commands/start-job.command'
import { JobStatus } from '@domain/enums/job.enum'
import { JobEntity } from '@domain/entities/job.entity'

@injectable()
export class StartJobCommandHandler {
  constructor(
    @inject(DynamodbJobRepository) private readonly jobRepository: JobRepository,
  ) {
  }

  async handle(command: StartJobCommand): Promise<void> {
    // Get the Job from database
    const job = await this.getJobFromDatabase(command.jobId)
    if (!job) {
      throw new Error('Job does not exists') // Todo: Make this a Custom Exception.
    }

    this.checkJobCanBeStarted(job)

    return this.startJob(job)
  }

  private async getJobFromDatabase(jobId: string): Promise<JobEntity | undefined> {
    return this.jobRepository.findById(jobId)
  }

  private checkJobCanBeStarted(job: JobEntity) {
    if (job.status === JobStatus.Pending || job.status === JobStatus.Failed) {
      return true
    }

    throw new Error('Job cannot be started.') // Todo: Make this a Custom Exception.
  }

  private async startJob(job: JobEntity): Promise<void> {
    job.status = JobStatus.InProgress
    job.attempts++
    job.updatedAt =

    return this.jobRepository.save(job)
  }
}
