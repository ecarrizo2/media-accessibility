import { Resource } from 'sst'
import { BaseDynamodbRepository } from '@infrastructure/repositories/base-dynamodb.repository'
import { JobEntity } from '@domain/entities/job/job.entity'
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
}
