import { inject, injectable } from 'tsyringe'
import OpenAI from 'openai'
import { Resource } from 'sst'
import { ImageAnalyserData } from '@domain/value-objects/image/image-analyser-data.vo'
import { ImageAnalysisResult } from '@domain/value-objects/image/image-analysis-result.vo'
import { LoggerService } from '@shared/logger/logger.service'
import { ChatCompletion } from 'openai/resources'
import { ImageAnalyserService } from '@domain/services/image/image-analyser.interface'
import { Logger } from '@shared/logger/logger.interface'

const apiKey = Resource.OpenaiApiKey.value
const openai = new OpenAI({
  apiKey,
})

@injectable()
export class OpenAIImageAnalyserService implements ImageAnalyserService {
  constructor(@inject(LoggerService) private readonly logger: Logger) {}

  async analyseImage(imageData: ImageAnalyserData): Promise<ImageAnalysisResult> {
    this.logger.debug('getAnalyzedImageResult()')
    const message = this.createImageAnalysisRequest(imageData)

    const openaiVisionRequest = { model: 'gpt-4o-mini', messages: [message] }
    this.logger.debug('About to execution vision request: ', openaiVisionRequest)

    // const openaiImageAnalysisResult = await openai.chat.completions.create(openaiVisionRequest)

    const openaiImageAnalysisResult: ChatCompletion = {
      id: 'chatcmpl-9zR3OMLnxfFCYj7Rrhg0LESVxTTXO',
      object: 'chat.completion',
      created: 1724429030,
      model: 'gpt-4o-mini-2024-07-18',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content:
              "The image showcases the vibrant Googleplex, the headquarters of Google, set against a bright blue sky. In the foreground, a large, cheerful green Android mascot stands prominently on a decorative base, symbolizing Google's popular mobile operating system. Behind the mascot is the Google logo, displayed in its iconic multicolored letters—blue, red, yellow, and green—spanning the glass façade of the building. Surrounding the area are lush plants and flowers, adding a touch of nature, while bicycles are lined up in the background, hinting at a bike-friendly environment. This lively scene reflects Google’s innovative spirit and commitment to creating an inviting workspace.",
            refusal: null,
          },
          logprobs: null,
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 36878,
        completion_tokens: 130,
        total_tokens: 37008,
      },
      system_fingerprint: 'fp_507c9469a1',
    }

    this.logger.debug('Analysed Image Result', openaiImageAnalysisResult)

    return ImageAnalysisResult.from({
      text: openaiImageAnalysisResult.choices[0].message.content ?? '',
      vendor: 'openai',
      raw: JSON.stringify(openaiImageAnalysisResult),
    })
  }

  private createImageAnalysisRequest(imageData: ImageAnalyserData) {
    const message: any = {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: imageData.url,
          },
        },
      ],
      max_tokens: 300,
    }

    if (imageData.prompt) {
      message.content.push({ type: 'text', text: imageData.prompt })
    }

    return message
  }
}

// Response Example of openIA if you don't want to consume credits while debugging
