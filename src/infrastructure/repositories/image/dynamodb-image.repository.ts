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
  /**
   * The name of the DynamoDB table.
   */
  protected readonly tableName = Resource.ImageDynamo.name

  constructor(@inject(LoggerService) logger: Logger) {
    super(logger)
  }

  /**
   * Converts a DynamoDB item to an ImageEntity.
   *
   * @param {any} item - The DynamoDB item.
   * @returns {ImageEntity} - The ImageEntity.
   */
  protected toEntity(item: any): ImageEntity {
    return new ImageEntity({
      id: item.id,
      url: item.imageUrl,
      prompt: item.prompt,
      analysisText: item.analysisText,
      analysisVendor: item.analysisVendor,
      analysisResultRaw: JSON.parse(item.analysisResultRaw),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })
  }

  /**
   * Converts an ImageEntity to a DynamoDB item.
   *
   * @param {ImageEntity} entity - The ImageEntity.
   * @returns {any} - The DynamoDB item.
   */
  protected toItem(entity: ImageEntity): any {
    return {
      id: entity.id,
      imageUrl: entity.url,
      prompt: entity.prompt,
      analysisText: entity.analysisText,
      analysisVendor: entity.analysisVendor,
      analysisResultRaw: JSON.stringify(entity.analysisResultRaw),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
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
      KeyConditionExpression: 'imageUrl = :imageUrl',
      ExpressionAttributeValues: {
        ':imageUrl': url,
      },
      Limit: 1,
    }

    return this.runQuery(queryCommandParams)
  }
}
