import { BaseRepository } from '@domain/repositories/base-repository.interface'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { BaseEntity } from '@domain/entities/base.entity'
import { Logger } from '@shared/logger/logger.interface'
import { PutCommandInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/PutCommand'
import { QueryCommandInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/QueryCommand'

/**
 * Abstract base class for DynamoDB repositories.
 * Provides common methods for interacting with DynamoDB.
 *
 * @template EntityType - The type of the entity.
 */
export abstract class BaseDynamodbRepository<EntityType> implements BaseRepository<EntityType> {
  /**
   * The name of the DynamoDB table.
   * Must be defined in the derived class.
   */
  protected abstract tableName: string

  /**
   * The DynamoDB Document Client instance.
   */
  protected client = DynamoDBDocumentClient.from(new DynamoDBClient({}))

  /**
   * Constructs a new BaseDynamodbRepository instance.
   * @param {Logger} logger - The logger service to use for logging.
   */
  protected constructor(protected readonly logger: Logger) {}

  /**
   * Converts a DynamoDB item to an entity.
   * Must be implemented in the derived class.
   *
   * @param {any} item - The DynamoDB item.
   * @returns {EntityType} - The entity.
   */
  protected abstract toEntity(item: Record<string, unknown>): EntityType

  /**
   * Converts an entity to a DynamoDB item.
   * Must be implemented in the derived class.
   *
   * @param {EntityType} entity - The entity.
   * @returns {any} - The DynamoDB item.
   */
  protected abstract toItem(entity: EntityType): Record<string, unknown>

  /**
   * Runs a query on the DynamoDB table.
   *
   * @param {any} queryCommandParams - The parameters for the query command.
   * @returns {Promise<any>} - The result of the query.
   */
  protected async runQuery(queryCommandParams: QueryCommandInput): Promise<EntityType | undefined> {
    this.logger.debug('Running query', queryCommandParams)
    const queryResult = await this.client.send(new QueryCommand(queryCommandParams))
    const value = queryResult?.Items?.length ? queryResult?.Items[0] : null
    if (!value) {
      return undefined
    }

    return this.toEntity(value)
  }

  /**
   * Finds an entity by its ID.
   *
   * @param {string} id - The ID of the entity.
   * @returns {Promise<EntityType | undefined>} - The entity or undefined if not found.
   */
  async findById(id: string): Promise<EntityType | undefined> {
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

  /**
   * Saves an entity to the DynamoDB table.
   *
   * @param {EntityType & BaseEntity} entity - The entity to save.
   * @returns {Promise<void>}
   */
  async save(entity: EntityType & BaseEntity): Promise<void> {
    entity.validateState()
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
