import { inject, injectable } from 'tsyringe'
import { DynamodbJobRepository } from '@infrastructure/repositories/job/dynamodb-job.repository'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { CompleteJobCommand } from '@application/commands/job/complete-job.command'

@injectable()
export class CompleteJobCommandHandler {
  constructor(@inject(DynamodbJobRepository) private readonly jobRepository: JobRepository) {}

  async handle(command: CompleteJobCommand): Promise<void> {
    const { job } = command
    job.complete()
    await this.jobRepository.save(job)
  }
}
