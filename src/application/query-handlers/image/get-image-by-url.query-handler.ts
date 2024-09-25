import { GetImageByUrlQuery } from '@application/queries/image/get-image-by-url.query'
import { ImageEntity } from '@domain/entities/image/image.entity'
import { inject, injectable } from 'tsyringe'
import { DynamodbImageRepository } from '@infrastructure/repositories/image/dynamodb-image.repository'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'

@injectable()
export class GetImageByUrlQueryHandler {
  constructor(@inject(DynamodbImageRepository) private readonly repository: ImageRepository) {}

  async execute(query: GetImageByUrlQuery): Promise<ImageEntity | null> {
    return this.repository.findByUrl(query.url)
  }
}
