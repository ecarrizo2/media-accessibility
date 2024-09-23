import { Resource } from 'sst'
import { BaseDynamodbRepository } from '@infrastructure/repositories/base-dynamodb.repository'
import { JobEntity, JobError } from '@domain/entities/job/job.entity'
import { JobStatus, JobType } from '@domain/enums/job/job.enum'
import { inject, injectable } from 'tsyringe'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'

/**
 * Repository class for managing Job entities in DynamoDB.
 * Extends the BaseDynamodbRepository to provide specific implementations for JobEntity.
 */
@injectable()
export class DynamodbJobRepository extends BaseDynamodbRepository<JobEntity> {
  /**
   * The name of the DynamoDB table.
   */
  protected readonly tableName = Resource.JobDynamo.name

  constructor(@inject(LoggerService) logger: Logger) {
    super(logger)
  }

  /**
   * Converts a DynamoDB item to a JobEntity.
   *
   * @param {any} item - The DynamoDB item.
   * @returns {JobEntity} - The JobEntity.
   */
  protected toEntity(item: Record<string, unknown>): JobEntity {
    return new JobEntity({
      id: item.id as string,
      type: item.type as JobType,
      status: item.status as JobStatus,
      attempts: item.attempts as number,
      input: JSON.parse(item.input as string),
      errors: JSON.parse(item.errors as string) as JobError[],
      createdAt: item.createdAt as string,
      updatedAt: item.updatedAt as string,
    })
  }

  /**
   * Converts a JobEntity to a DynamoDB item.
   *
   * @param {JobEntity} entity - The JobEntity.
   * @returns {any} - The DynamoDB item.
   */
  protected toItem(entity: JobEntity): Record<string, unknown> {
    return {
      id: entity.id,
      type: entity.type,
      status: entity.status as string,
      attempts: entity.attempts,
      input: JSON.stringify(entity.input),
      errors: JSON.stringify(entity.errors),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
