import { ProcessImageRequestInput } from '@domain/value-objects/image/process-image-request-input.vo'
import { ImageEntity } from '@domain/entities/image/image.entity'

/**
 * Interface representing an image processor.
 */
export interface ImageProcessor {
  /**
   * Processes an image based on the provided input.
   * @param {ProcessImageRequestInput} input - The input data for processing the image.
   * @returns {Promise<ImageEntity>} - A promise that resolves to the processed ImageEntity.
   */
  processImage(input: ProcessImageRequestInput): Promise<ImageEntity>
}
