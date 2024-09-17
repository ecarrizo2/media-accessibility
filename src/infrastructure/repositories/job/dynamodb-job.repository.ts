import { Resource } from 'sst'
import { BaseDynamodbRepository } from '@infrastructure/repositories/base-dynamodb.repository'
import { JobEntity } from '@domain/entities/job/job.entity'
import { JobStatus, JobType } from '@domain/enums/job/job.enum'
import { inject, injectable } from 'tsyringe'
import { LoggerService } from '@shared/logger.service'

@injectable()
export class DynamodbJobRepository extends BaseDynamodbRepository<JobEntity> {
  //@ts-ignore
  protected readonly tableName = Resource.JobDynamo.name

  constructor(@inject(LoggerService) logger: LoggerService) {
    super(logger)
  }

  protected toEntity(item: any): JobEntity {
    return new JobEntity({
      id: item.id as string,
      type: item.type as JobType,
      status: item.status as JobStatus,
      attempts: item.attempts,
      input: JSON.parse(item.input),
      errors: JSON.parse(item.errors),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })
  }

  protected toItem(entity: JobEntity): any {
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
