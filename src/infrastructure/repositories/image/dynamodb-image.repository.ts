import { ImageEntity } from '@domain/entities/image.entity'
import { Resource } from 'sst'
import { BaseDynamodbRepository } from '@infrastructure/repositories/base-dynamodb.repository'

export class DynamodbImageRepository extends BaseDynamodbRepository<ImageEntity> {
  //@ts-ignore
  protected readonly tableName = Resource.ImageMetadataDynamo.name

  protected toEntity(item: any): ImageEntity {
    return new ImageEntity({
      url: item.imageUrl,
      description: item.description,
    })
  }

  protected toItem(entity: ImageEntity): any {
    return {
      url: entity.url,
      description: entity.description,
    }
  }

  async getByUrl(url: string): Promise<ImageEntity | null> {
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
