import { inject, injectable } from 'tsyringe'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { GetJobByIdQuery } from '@application/queries/job/get-job-by-id.query'
import { JobEntity } from '@domain/entities/job/job.entity'
import { DynamodbJobRepository } from '@infrastructure/repositories/job/dynamodb-job.repository'

@injectable()
export class GetJobByIdQueryHandler {
  constructor(@inject(DynamodbJobRepository) private readonly jobRepository: JobRepository) {}

  async handle(query: GetJobByIdQuery): Promise<JobEntity | undefined> {
    return this.jobRepository.findById(query.jobId)
  }
}
