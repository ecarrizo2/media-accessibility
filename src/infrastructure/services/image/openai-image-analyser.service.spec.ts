import { createMock } from '@golevelup/ts-jest'
import { OpenAIImageAnalyserService } from '@infrastructure/services/image/openai-image-analyser.service'
import { LoggerService } from '@shared/logger/logger.service'
import { openaiImageAnalysisResultMock } from '../../../../test/mocks/openai.mock'
import OpenAI from 'openai'
import { ClassValidatorError } from '@shared/errors/class-validator.error'
import { ImageAnalysisResult } from '@domain/value-objects/image/image-analysis-result.vo'
import { ChatCompletion } from 'openai/src/resources/chat/completions'

describe('OpenaiImageAnalyserService', () => {
  let service: OpenAIImageAnalyserService
  const logger = createMock<LoggerService>()
  const openaiMock = createMock<OpenAI>()

  // Some mocks, we move this.
  const imageDataWithoutPrompt = { url: 'https://image.com', prompt: '' }
  const imageDataWithPrompt = { url: 'https://image.com', prompt: 'test' }

  const openaiRequestMessageNoPrompt = {
    role: 'user',
    content: [
      {
        type: 'image_url',
        image_url: {
          url: imageDataWithoutPrompt.url,
        },
      },
    ],
  }

  const openaiVisionRequest = {
    model: 'gpt-4o-mini',
    messages: [openaiRequestMessageNoPrompt],
    max_tokens: 300,
  }

  const openaiRequestMessagePrompt = {
    role: 'user',
    content: [
      {
        type: 'image_url',
        image_url: {
          url: imageDataWithPrompt.url,
        },
      },
      {
        type: 'text',
        text: imageDataWithPrompt.prompt,
      },
    ],
  }

  const openaiVisionRequestPrompt = {
    model: 'gpt-4o-mini',
    messages: [openaiRequestMessagePrompt],
    max_tokens: 300,
  }

  beforeEach(() => {
    service = new OpenAIImageAnalyserService(logger)
    service.openai = openaiMock
  })

  afterEach(jest.resetAllMocks)

  describe('analyseImage()', () => {
    describe('WHEN Analysing the image', () => {
      describe('AND the Third Party errored out', () => {
        it('THEN should throw the error to the caller', async () => {
          const error = new Error('Third Party Error')
          jest.spyOn(service, 'analyseImage').mockRejectedValue(error)
          await expect(service.analyseImage({ url: 'https://image.com', prompt: '' })).rejects.toThrow(error)
        })
      })

      describe('AND building and sending the request to the Third Party', () => {
        describe('AND the input does not contain a prompt', () => {
          it('THEN should not add the prompt to the request', async () => {
            jest.spyOn(service.openai.chat.completions, 'create').mockResolvedValue(openaiImageAnalysisResultMock)
            await service.analyseImage(imageDataWithoutPrompt)
            expect(service.openai.chat.completions.create).toHaveBeenCalledWith(openaiVisionRequest)
          })
        })

        describe('AND the input does contain a prompt', () => {
          it('THEN should not add the prompt to the request', async () => {
            jest.spyOn(service.openai.chat.completions, 'create').mockResolvedValue(openaiImageAnalysisResultMock)
            await service.analyseImage(imageDataWithPrompt)
            expect(service.openai.chat.completions.create).toHaveBeenCalledWith(openaiVisionRequestPrompt)
          })
        })
      })

      describe('AND the Third Party returns a result but the result has broken its contract', () => {
        it('THEN ImageAnalysisResult will throw an exception', async () => {
          jest.spyOn(service.openai.chat.completions, 'create').mockResolvedValue({} as ChatCompletion)
          const promise = service.analyseImage(imageDataWithoutPrompt)
          await promise.catch((error) => {
            expect(error).toBeInstanceOf(ClassValidatorError)
            expect(service.openai.chat.completions.create).toHaveBeenCalledWith(openaiVisionRequest)
          })
        })
      })

      describe('AND Third Party Response returns the expected contract (happy path)', () => {
        it('THEN should return a ImageAnalysisResult', async () => {
          jest.spyOn(service.openai.chat.completions, 'create').mockResolvedValue(openaiImageAnalysisResultMock)
          const unitResult = await service.analyseImage(imageDataWithPrompt)
          expect(service.openai.chat.completions.create).toHaveBeenCalledWith(openaiVisionRequestPrompt)
          expect(unitResult).toBeInstanceOf(ImageAnalysisResult)
        })
      })
    })
  })
})
