import { inject, injectable } from 'tsyringe'
import OpenAI from 'openai'
import { Resource } from 'sst'
import { ImageAnalysisResult } from '@domain/value-objects/image/image-analysis-result.vo'
import { LoggerService } from '@shared/logger/logger.service'
import { ImageAnalyserService } from '@domain/services/image/image-analyser.interface'
import { Logger } from '@shared/logger/logger.interface'
import { ImageAnalyserInput } from '@domain/value-objects/image/image-analyser-input.vo'
import { ChatCompletionMessageParam } from 'openai/resources'

const apiKey = Resource.OpenaiApiKey.value
const openai = new OpenAI({
  apiKey,
})

/**
 * Service to analyze images using OpenAI's API.
 */
@injectable()
export class OpenAIImageAnalyserService implements ImageAnalyserService {
  constructor(@inject(LoggerService) private readonly logger: Logger) {}

  /**
   * Analyzes the provided image data and returns the analysis result.
   *
   * @param {ImageAnalyserInput} imageData - The data of the image to analyze.
   * @returns {Promise<ImageAnalysisResult>} - The result of the image analysis.
   */
  async analyseImage(imageData: ImageAnalyserInput): Promise<ImageAnalysisResult> {
    this.logger.debug('getAnalyzedImageResult()')
    const message = this.createImageAnalysisRequest(imageData)

    const openaiVisionRequest = { model: 'gpt-4o-mini', messages: [message], max_tokens: 300 }
    this.logger.debug('About to execution vision request: ', openaiVisionRequest)

    const openaiImageAnalysisResult = await openai.chat.completions.create(openaiVisionRequest)
    this.logger.debug('Analysed Image Result', openaiImageAnalysisResult)

    return ImageAnalysisResult.from({
      text: openaiImageAnalysisResult.choices[0].message.content ?? '',
      vendor: 'openai',
      raw: JSON.stringify(openaiImageAnalysisResult),
    })
  }

  /**
   * Creates an image analysis request message for OpenAI.
   *
   * @param {ImageAnalyserInput} imageData - The data of the image to analyze.
   * @returns {object} - The message object for the image analysis request.
   */
  private createImageAnalysisRequest(imageData: ImageAnalyserInput): ChatCompletionMessageParam {
    const message: ChatCompletionMessageParam = {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: imageData.url,
          },
        },
      ],
    }

    if (imageData.prompt && message.content instanceof Array) {
      message.content.push({ type: 'text', text: imageData.prompt })
    }

    return message
  }
}

// Response Example of openIA if you don't want to consume credits while debugging
// const openaiImageAnalysisResult: ChatCompletion = {
//   id: 'chatcmpl-9zR3OMLnxfFCYj7Rrhg0LESVxTTXO',
//   object: 'chat.completion',
//   created: 1724429030,
//   model: 'gpt-4o-mini-2024-07-18',
//   choices: [
//     {
//       index: 0,
//       message: {
//         role: 'assistant',
//         content:
//           "The image showcases the vibrant Googleplex, the headquarters of Google, set against a bright blue sky. In the foreground, a large, cheerful green Android mascot stands prominently on a decorative base, symbolizing Google's popular mobile operating system. Behind the mascot is the Google logo, displayed in its iconic multicolored letters—blue, red, yellow, and green—spanning the glass façade of the building. Surrounding the area are lush plants and flowers, adding a touch of nature, while bicycles are lined up in the background, hinting at a bike-friendly environment. This lively scene reflects Google’s innovative spirit and commitment to creating an inviting workspace.",
//         refusal: null,
//       },
//       logprobs: null,
//       finish_reason: 'stop',
//     },
//   ],
//   usage: {
//     prompt_tokens: 36878,
//     completion_tokens: 130,
//     total_tokens: 37008,
//   },
//   system_fingerprint: 'fp_507c9469a1',
// }
