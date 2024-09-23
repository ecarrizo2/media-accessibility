import { inject, injectable } from 'tsyringe'
import { v4 } from 'uuid'
import { DynamodbJobRepository } from '@infrastructure/repositories/job/dynamodb-job.repository'
import { JobRepository } from '@domain/repositories/job/job-repository.interface'
import { CreateJobCommand } from '@application/commands/job/create-job.command'
import { JobEntity } from '@domain/entities/job/job.entity'
import { JobStatus } from '@domain/enums/job/job.enum'

@injectable()
export class CreateJobCommandHandler {
  constructor(@inject(DynamodbJobRepository) private readonly jobRepository: JobRepository) {}

  /**
   * Handle the CreateJob Command by creating a new Job Entity and Saving it to the Database.
   *
   * @param {CreateJobCommand} command - Create Job Commands instance
   * @returns {Promise<JobEntity>} - The created job entity
   */
  async handle(command: CreateJobCommand): Promise<JobEntity> {
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
