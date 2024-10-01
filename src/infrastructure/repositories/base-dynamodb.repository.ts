import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { BaseEntity } from '@domain/entities/base.entity'
import { Logger } from '@shared/logger/logger.interface'
import { PutCommandInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/PutCommand'
import { QueryCommandInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/QueryCommand'
import { EntityTransformableRepository } from '@domain/repositories/base.repository'
import { Repository } from '@domain/repositories/repository.interface'

/**
 * Abstract base class for DynamoDB repositories.
 * Provides common methods for interacting with DynamoDB.
 */
export abstract class BaseDynamodbRepository<EntityType>
  extends EntityTransformableRepository<EntityType>
  implements Repository<EntityType>
{
  /**
   * The name of the DynamoDB table.
   * Must be defined in the derived class.
   */
  protected abstract tableName: string

  protected client = DynamoDBDocumentClient.from(new DynamoDBClient({}))

  protected constructor(protected readonly logger: Logger) {
    super()
  }

  protected async runQuery(queryCommandParams: QueryCommandInput): Promise<EntityType | null> {
    this.logger.debug('Running query', queryCommandParams)
    const queryResult = await this.client.send(new QueryCommand(queryCommandParams))
    const value = queryResult?.Items?.length ? queryResult?.Items[0] : null
    if (!value) {
      return null
    }

    return this.toEntity(value)
  }

  async findById(id: string): Promise<EntityType | null> {
    const queryCommandParams: QueryCommandInput = {
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
    await entity.validateState()
    entity.updatedAt = new Date().toISOString()

    const existingEntity = await this.findById(entity.id)
    const commandInstructions: PutCommandInput = {
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
