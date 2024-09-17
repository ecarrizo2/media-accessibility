import { ImageAnalyserData } from '@domain/value-objects/image/image-analyser-data.vo'
import { ImageAnalysisResult } from '@domain/value-objects/image/image-analysis-result.vo'

/**
 * Interface for the Image Analyser Service.
 */
export interface ImageAnalyserService {
  /**
   * Analyzes the given image data and returns the analysis result.
   * @param {ImageAnalyserData} imageData - The data of the image to be analyzed.
   * @returns {Promise<ImageAnalysisResult>} - The result of the image analysis.
   */
  analyseImage(imageData: ImageAnalyserData): Promise<ImageAnalysisResult>
}
