import { GetImageByUrlQuery } from '@application/queries/image/get-image-by-url.query'
import { ImageEntity } from '@domain/entities/image/image.entity'
import { ImageService } from '@domain/services/image/image.service'
import { ImageUrl } from '@domain/value-objects/image/image-url.vo'

export class GetImageByUrlQueryHandler {
  constructor(private readonly imageService: ImageService) {
  }

  async execute(query: GetImageByUrlQuery): Promise<ImageEntity|null> {
    return this.imageService.getImageByUrl(
      new ImageUrl({ url: query.url }),
    )
  }
}
