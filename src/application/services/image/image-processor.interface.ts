import { ImageEntity } from '@domain/entities/image/image.entity'
import { ProcessImageRequestInputDto } from '@domain/value-objects/image/process-image-request-input.vo'

/**
 * Interface representing an image processor.
 */
export interface ImageProcessor {
  /**
   * Processes an image based on the provided input.
   * @param {ProcessImageRequestInputDto} input - The input data for processing the image.
   * @returns {Promise<ImageEntity>} - A promise that resolves to the processed ImageEntity.
   */
  processImage(input: ProcessImageRequestInputDto): Promise<ImageEntity>
}
