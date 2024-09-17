import { BaseRepository } from '@domain/repositories/base-repository.interface'

import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { inject } from 'tsyringe'
import { LoggerService } from '@shared/logger.service'
import { BaseEntity } from '@domain/entities/base.entity'

export abstract class BaseDynamodbRepository<EntityType> implements BaseRepository<EntityType> {
  protected abstract tableName: string
  protected client = DynamoDBDocumentClient.from(new DynamoDBClient({}))

  constructor(@inject(LoggerService) protected readonly logger: LoggerService) {}

  protected abstract toEntity(item: any): EntityType

  protected abstract toItem(entity: EntityType): any

  protected async runQuery(queryCommandParams: any): Promise<any> {
    this.logger.debug('Running query', queryCommandParams)
    const queryResult = await this.client.send(new QueryCommand(queryCommandParams))
    const value = queryResult?.Items?.length ? queryResult?.Items[0] : null
    if (!value) {
      return undefined
    }

    return this.toEntity(value)
  }

  async findById(id: string): Promise<EntityType | undefined> {
    const queryCommandParams = {
      TableName: this.tableName,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id,
      },
      Limit: 1,
    }

    return this.runQuery(queryCommandParams)
  }

  async save(entity: EntityType & BaseEntity): Promise<void> {
    entity.updatedAt = new Date().toISOString()
    const existingEntity = await this.findById(entity.id)
    const commandInstructions: any = {
      TableName: this.tableName,
      Item: {
        ...existingEntity,
        ...this.toItem(entity),
      },
    }

    if (existingEntity) {
      commandInstructions.ConditionExpression = 'attribute_exists(id)'
    }

    await this.client.send(new PutCommand(commandInstructions))
  }
}
