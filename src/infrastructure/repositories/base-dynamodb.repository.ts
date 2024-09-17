import { BaseRepository } from '@domain/repositories/base-repository.interface'

import { DynamoDBDocumentClient, PutCommand, QueryCommand, QueryCommandOutput } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { inject } from 'tsyringe'
import { LoggerService } from '@utils/logger.service'


export abstract class BaseDynamodbRepository<T> implements BaseRepository<T> {
  protected abstract tableName: string
  protected client = DynamoDBDocumentClient.from(new DynamoDBClient({}))

  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
  ) {
  }

  protected abstract toEntity(item: any): T;

  protected abstract toItem(entity: T): any;

  protected async runQuery(queryCommandParams: any): Promise<any> {
    this.logger.debug('Running query', queryCommandParams)
    const queryResult = await this.client.send(new QueryCommand(queryCommandParams))
    const value = queryResult?.Items?.length ? (queryResult?.Items[0]) : null
    if (!value) {
      return undefined
    }

    return this.toEntity(value)
  }

  async findById(id: string): Promise<T | undefined> {
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

  async save(entity: T): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: this.toItem(entity),
      }),
    )
  }


}
