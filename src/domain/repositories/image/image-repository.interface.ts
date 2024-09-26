import { ImageEntity } from '../../entities/image/image.entity'
import { BaseRepository } from '@domain/repositories/repository.interface'

/**
 * Interface representing a repository for managing Image entities.
 * Extends the BaseRepository interface to provide specific implementations for ImageEntity.
 */
export interface ImageRepository extends BaseRepository<ImageEntity> {
  /**
   * Finds an image by its URL.
   *
   * @param {string} url - The URL of the image.
   * @returns {Promise<ImageEntity | null>} - A promise that resolves to the image or null if not
   */
  findByUrl(url: string): Promise<ImageEntity | null>
}
