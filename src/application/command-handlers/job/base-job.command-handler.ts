import { JobEntity } from '@domain/entities/job/job.entity'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { JobNotFoundError } from '@domain/errors/job/job-not-found.error'

export class BaseJobCommandHandler {
  constructor(protected readonly jobRepository: JobRepository) {}

  protected async getJobFromDatabase(jobId: string): Promise<JobEntity> {
    const job = await this.jobRepository.findById(jobId)
    if (!job) {
      throw new JobNotFoundError()
    }

    return job
  }
}
