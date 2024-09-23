import { ImageAnalysisResult } from '@domain/value-objects/image/image-analysis-result.vo'
import { ImageAnalyserInput } from '@domain/value-objects/image/image-analyser-input.vo'

/**
 * Interface for the Image Analyser Service.
 */
export interface ImageAnalyserService {
  /**
   * Analyzes the given image data and returns the analysis result.
   * @param {ImageAnalyserInput} imageData - The data of the image to be analyzed.
   * @returns {Promise<ImageAnalysisResult>} - The result of the image analysis.
   */
  analyseImage(imageData: ImageAnalyserInput): Promise<ImageAnalysisResult>
}
