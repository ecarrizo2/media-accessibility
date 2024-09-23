import { ImageEntity } from '@domain/entities/image/image.entity'
import { Resource } from 'sst'
import { BaseDynamodbRepository } from '@infrastructure/repositories/base-dynamodb.repository'
import { inject, injectable } from 'tsyringe'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'

@injectable()
export class DynamodbImageRepository extends BaseDynamodbRepository<ImageEntity> implements ImageRepository {
  protected readonly tableName = Resource.ImageDynamo.name

  constructor(@inject(LoggerService) logger: Logger) {
    super(logger)
  }

  protected toEntity(item: any): ImageEntity {
    return new ImageEntity({
      id: item.id,
      url: item.imageUrl,
      prompt: item.prompt,
      analysisText: item.analysisText,
      analysisVendor: item.analysisVendor,
      analysisResultRaw: JSON.parse(item.analysisResultRaw),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    })
  }

  protected toItem(entity: ImageEntity): any {
    return {
      id: entity.id,
      imageUrl: entity.url,
      prompt: entity.prompt,
      analysisText: entity.analysisText,
      analysisVendor: entity.analysisVendor,
      analysisResultRaw: JSON.stringify(entity.analysisResultRaw),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }
  }

  async findByUrl(url: string): Promise<ImageEntity | null> {
    const queryCommandParams = {
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
