import { ImageEntity } from '@domain/entities/image/image.entity'
import { Resource } from 'sst'
import { BaseDynamodbRepository } from '@infrastructure/repositories/base-dynamodb.repository'
import { inject, injectable } from 'tsyringe'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'
import { QueryCommandInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/QueryCommand'

/**
 * Repository class for managing Image entities in DynamoDB.
 * Extends the BaseDynamodbRepository to provide specific implementations for ImageEntity.
 */
@injectable()
export class DynamodbImageRepository extends BaseDynamodbRepository<ImageEntity> implements ImageRepository {
  entityClass = ImageEntity

  /**
   * The name of the DynamoDB table.
   */
  protected readonly tableName = Resource.ImageDynamo.name

  constructor(@inject(LoggerService) logger: Logger) {
    super(logger)
  }

  /**
   * Finds an ImageEntity by its URL.
   *
   * @param {string} url - The URL of the image.
   * @returns {Promise<ImageEntity | null>} - The ImageEntity or null if not found.
   */
  async findByUrl(url: string): Promise<ImageEntity | null> {
    const queryCommandParams: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: 'ImageUrlIndex',
      KeyConditionExpression: '#url = :url',
      ExpressionAttributeNames: {
        '#url': 'url',
      },
      ExpressionAttributeValues: {
        ':url': url,
      },
      Limit: 1,
    }

    return this.runQuery(queryCommandParams)
  }
}
