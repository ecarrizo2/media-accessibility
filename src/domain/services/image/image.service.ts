import { ImageEntity } from '@domain/entities/image/image.entity'
import { ImageUrl } from '@domain/value-objects/image/image-url.vo'
import { DynamodbImageRepository } from '@infrastructure/repositories/image/dynamodb-image.repository'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'
import { inject, injectable } from 'tsyringe'


@injectable()
export class ImageService {
  constructor(
    @inject(DynamodbImageRepository) private readonly imageRepository: ImageRepository,
  ) {
  }

  async getImageByUrl(imageUrl: ImageUrl): Promise<ImageEntity | null> {
    return this.imageRepository.findByUrl(imageUrl.url)
  }
}
