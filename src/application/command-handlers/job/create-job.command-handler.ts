import { inject, injectable } from 'tsyringe'
import { v4 } from 'uuid'
import { DynamodbJobRepository } from '@infrastructure/repositories/dynamodb-job.repository'
import { JobRepository } from '@domain/repositories/job-repository.interface'
import { CreateJobCommand } from '@application/commands/create-job.command'
import { JobEntity } from '@domain/entities/job.entity'
import { JobStatus } from '@domain/enums/job.enum'

@injectable()
export class CreateJobCommandHandler {
  constructor(
    @inject(DynamodbJobRepository) private readonly jobRepository: JobRepository,
  ) {
  }

  /**
   * Handle the CreateJob Command by creating a new Job Entity and Saving it to the Database.
   *
   * @param {CreateJobCommand<unknown>} command - Create Job Commands instance
   * @returns {Promise<JobEntity>} - The created job entity
   */
  async handle(command: CreateJobCommand<unknown>): Promise<JobEntity> {
    const jobEntity = new JobEntity({
      id: v4(),
      type: command.type,
      status: JobStatus.Pending,
      input: command.input,
      attempts: 0,
      errors: null,
      createdAt: new Date().toISOString(),
    })

    await this.jobRepository.save(jobEntity)

    return jobEntity
  }
}
