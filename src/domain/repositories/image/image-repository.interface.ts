import { ImageEntity } from '../../entities/image/image.entity'
import { Repository } from '@domain/repositories/repository.interface'

export interface ImageRepository extends Repository<ImageEntity> {
  /**
   * Finds an image by its URL.
   *
   * @param {string} url - The URL of the image.
   * @returns {Promise<ImageEntity | null>} - A promise that resolves to the image or null if not
   */
  findByUrl(url: string): Promise<ImageEntity | null>
}
