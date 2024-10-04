import { createMock } from '@golevelup/ts-jest'
import { ImageProcessorService } from '@application/services/image/image-processor.service'
import { GetImageByUrlQueryHandler } from '@application/query-handlers/image/get-image-by-url.query-handler'
import { AnalyseImageCommandHandler } from '@application/command-handlers/image/analyse-image.command-handler'
import { CreateImageCommandHandler } from '@application/command-handlers/image/create-image.command-handler'
import { ProcessImageRequestInputDto } from '@domain/value-objects/image/process-image-request-input.vo'
import { ImageEntity } from '@domain/entities/image/image.entity'
import { plainToInstance } from 'class-transformer'
import { ClassValidatorError } from '@shared/errors/class-validator.error'
import { GetImageByUrlQuery } from '@application/queries/image/get-image-by-url.query'
import { AnalyseImageCommand } from '@application/commands/image/analyse-image.command'
import { ImageAnalysisResult } from '@domain/value-objects/image/image-analysis-result.vo'
import { CreateImageCommand } from '@application/commands/image/create-image-command'

describe('ImageProcessorService', () => {
  const getImageByUrlQueryHandler = createMock<GetImageByUrlQueryHandler>()
  const analyzeImageCommandHandler = createMock<AnalyseImageCommandHandler>()
  const createImageCommandHandler = createMock<CreateImageCommandHandler>()
  const validInput: ProcessImageRequestInputDto = plainToInstance(ProcessImageRequestInputDto, {
    url: 'https://example.com/image.jpg',
    prompt: 'A sample prompt',
  })

  const validImageAnalysisResult = plainToInstance(ImageAnalysisResult, {
    text: 'A description',
    vendor: 'OpenAI',
    raw: '{}',
  })

  const getInstance = () => {
    return new ImageProcessorService(getImageByUrlQueryHandler, analyzeImageCommandHandler, createImageCommandHandler)
  }

  describe('WHEN image processing requested', () => {
    describe('AND attempting to return existing image', () => {
      describe('AND the image exists (happy path #1)', () => {
        const existingImage = createMock<ImageEntity>()
        let promise: Promise<ImageEntity>

        beforeAll(() => {
          jest.spyOn(getImageByUrlQueryHandler, 'execute').mockResolvedValue(existingImage)
          promise = getInstance().processImage(validInput)
        })

        afterAll(jest.resetAllMocks)

        it('THEN it should have executed find image by url query', async () => {
          await promise
          expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledTimes(1)
          expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledWith(expect.anything())
        })

        it('AND it should return the existing image value', async () => {
          const result = await promise
          expect(result).toBe(existingImage)
        })

        it('AND it should not have attempted the Analyse Image flow', () => {
          expect(analyzeImageCommandHandler.handle).not.toHaveBeenCalled()
          expect(createImageCommandHandler.handle).not.toHaveBeenCalled()
        })
      })

      describe('AND creating the GetImageByUrl query fails', () => {
        let promise: Promise<ImageEntity>
        beforeAll(() => {
          promise = getInstance().processImage(
            plainToInstance(ProcessImageRequestInputDto, {
              url: 'invalid-url',
              prompt: '',
            })
          )
        })

        afterAll(jest.resetAllMocks)

        it('THEN it should have attempted to create the GetImageByUrl query', async () => {
          await expect(promise).rejects.toThrow(ClassValidatorError)
        })

        it('AND it should not attempted to execute other parts of the flow', async () => {
          await promise.catch(() => {
            expect(getImageByUrlQueryHandler.execute).not.toHaveBeenCalled()
            expect(analyzeImageCommandHandler.handle).not.toHaveBeenCalled()
            expect(createImageCommandHandler.handle).not.toHaveBeenCalled()
          })
        })
      })

      describe('AND the getImageByUrl query handlers throws an error', () => {
        let promise: Promise<ImageEntity>
        const queryFailedError = new Error('error while handling query')

        beforeAll(() => {
          jest.spyOn(getImageByUrlQueryHandler, 'execute').mockRejectedValue(queryFailedError)
          promise = getInstance().processImage(plainToInstance(ProcessImageRequestInputDto, validInput))
        })

        afterAll(jest.resetAllMocks)

        it('THEN it should have attempted to handle getImageByUrl query', async () => {
          await promise.catch(() => {
            expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledTimes(1)
            expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledWith(
              plainToInstance(GetImageByUrlQuery, { url: validInput.url })
            )
          })
        })

        it('AND it should have thrown an error to the caller', async () => {
          await expect(promise).rejects.toThrow(queryFailedError)
        })
      })
    })
  })

  describe('AND the Analyse and creating image flow (previous no existing image)', () => {
    describe('AND creating image analysis command fails', () => {
      let promise: Promise<ImageEntity>
      beforeAll(() => {
        jest.spyOn(getImageByUrlQueryHandler, 'execute').mockResolvedValue(null)
        promise = getInstance().processImage({ url: 'https://example.com/image.jpg', prompt: '' })
      })

      afterAll(jest.resetAllMocks)

      it('THEN it should have attempted to return existing image', async () => {
        await promise.catch(() => {
          expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledTimes(1)
          expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledWith(
            plainToInstance(GetImageByUrlQuery, { url: validInput.url })
          )
        })
      })

      it('AND it should throw an error to the caller as analyse image command creation failed', async () => {
        await expect(promise).rejects.toThrow(ClassValidatorError)
      })

      it('AND it should not have attempted to the rest of the flow', async () => {
        await promise.catch(() => {
          expect(analyzeImageCommandHandler.handle).not.toHaveBeenCalled()
          expect(createImageCommandHandler.handle).not.toHaveBeenCalled()
        })
      })
    })

    describe('AND the Analyse Image command Handler fails', () => {
      let promise: Promise<ImageEntity>
      const analyseImageHandlerError = new Error('Analysis failed')
      beforeAll(() => {
        jest.spyOn(getImageByUrlQueryHandler, 'execute').mockResolvedValue(null)
        jest.spyOn(analyzeImageCommandHandler, 'handle').mockRejectedValue(analyseImageHandlerError)
        promise = getInstance().processImage(validInput)
      })

      afterAll(jest.resetAllMocks)

      it('THEN it should have attempted to return existing image', async () => {
        await promise.catch(() => {
          expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledTimes(1)
          expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledWith(
            plainToInstance(GetImageByUrlQuery, { url: validInput.url })
          )
        })
      })

      it('AND it should have attempted to analyse the image', async () => {
        await promise.catch(() => {
          expect(analyzeImageCommandHandler.handle).toHaveBeenCalledTimes(1)
          expect(analyzeImageCommandHandler.handle).toHaveBeenCalledWith(
            plainToInstance(AnalyseImageCommand, { url: validInput.url, prompt: validInput.prompt })
          )
        })
      })

      it('AND it should have attempted to analyse the image but throw an error to the caller', async () => {
        await expect(promise).rejects.toThrow(analyseImageHandlerError)
      })

      it('AND should not have attempted to create the image', () => {
        expect(createImageCommandHandler.handle).not.toHaveBeenCalled()
      })
    })

    describe('AND Creating the CreateImageCommand fails', () => {
      let promise: Promise<ImageEntity>
      const invalidAnalyzeImageResult = {
        text: 'A description',
        vendor: 'OpenAI',
        raw: '',
      }

      beforeAll(() => {
        jest.spyOn(getImageByUrlQueryHandler, 'execute').mockResolvedValue(null)
        jest.spyOn(analyzeImageCommandHandler, 'handle').mockResolvedValue(invalidAnalyzeImageResult)
        promise = getInstance().processImage(validInput)
      })

      afterAll(jest.resetAllMocks)

      it('THEN it should have attempted to return existing image', async () => {
        await promise.catch(() => {
          expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledTimes(1)
          expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledWith(
            plainToInstance(GetImageByUrlQuery, { url: validInput.url })
          )
        })
      })

      it('AND it have analyzed the image', async () => {
        await promise.catch(() => {
          expect(analyzeImageCommandHandler.handle).toHaveBeenCalledTimes(1)
          expect(analyzeImageCommandHandler.handle).toHaveBeenCalledWith(
            plainToInstance(AnalyseImageCommand, { url: validInput.url, prompt: validInput.prompt })
          )
        })
      })

      it('AND it should have attempted to create the image but throw an error to the caller', async () => {
        await expect(promise).rejects.toThrow(ClassValidatorError)
      })

      it('AND should not have attempted to create the image', async () => {
        await promise.catch(() => {
          expect(createImageCommandHandler.handle).not.toHaveBeenCalled()
        })
      })
    })

    describe('AND Handling the CreateImageCommand fails', () => {
      let promise: Promise<ImageEntity>
      const createImageCommandError = new Error('Creation failed')

      beforeAll(() => {
        jest.spyOn(getImageByUrlQueryHandler, 'execute').mockResolvedValue(null)
        jest.spyOn(analyzeImageCommandHandler, 'handle').mockResolvedValue(validImageAnalysisResult)
        jest.spyOn(createImageCommandHandler, 'handle').mockRejectedValue(createImageCommandError)
        promise = getInstance().processImage(validInput)
      })

      afterAll(jest.resetAllMocks)

      it('THEN it should have attempted to return existing image', async () => {
        await promise.catch(() => {
          expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledTimes(1)
          expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledWith(
            plainToInstance(GetImageByUrlQuery, { url: validInput.url })
          )
        })
      })

      it('AND it have analyzed the image', async () => {
        await promise.catch(() => {
          expect(analyzeImageCommandHandler.handle).toHaveBeenCalledTimes(1)
          expect(analyzeImageCommandHandler.handle).toHaveBeenCalledWith(
            plainToInstance(AnalyseImageCommand, { url: validInput.url, prompt: validInput.prompt })
          )
        })
      })

      it('AND it should have attempted to create the image but throw an error to the caller', async () => {
        await expect(promise).rejects.toThrow(createImageCommandError)
        await promise.catch(() => {
          expect(createImageCommandHandler.handle).toHaveBeenCalledTimes(1)
          expect(createImageCommandHandler.handle).toHaveBeenCalledWith(
            plainToInstance(CreateImageCommand, {
              url: validInput.url,
              prompt: validInput.prompt,
              imageAnalysisResult: validImageAnalysisResult,
            })
          )
        })
      })
    })

    describe('AND the image can be created successfully (happy path)', () => {
      let promise: Promise<ImageEntity>
      const newImage = createMock<ImageEntity>()

      beforeAll(() => {
        jest.spyOn(getImageByUrlQueryHandler, 'execute').mockResolvedValue(null)
        jest.spyOn(analyzeImageCommandHandler, 'handle').mockResolvedValue(validImageAnalysisResult)
        jest.spyOn(createImageCommandHandler, 'handle').mockResolvedValue(newImage)
        promise = getInstance().processImage(validInput)
      })

      afterAll(jest.resetAllMocks)

      it('THEN it should have attempted to return existing image', async () => {
        await promise
        expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledTimes(1)
        expect(getImageByUrlQueryHandler.execute).toHaveBeenCalledWith(
          plainToInstance(GetImageByUrlQuery, { url: validInput.url })
        )
      })

      it('AND it have analyzed the image', async () => {
        await promise
        expect(analyzeImageCommandHandler.handle).toHaveBeenCalledTimes(1)
        expect(analyzeImageCommandHandler.handle).toHaveBeenCalledWith(
          plainToInstance(AnalyseImageCommand, { url: validInput.url, prompt: validInput.prompt })
        )
      })

      it('AND it should have attempted created the image', async () => {
        await promise
        expect(createImageCommandHandler.handle).toHaveBeenCalledTimes(1)
        expect(createImageCommandHandler.handle).toHaveBeenCalledWith(
          plainToInstance(CreateImageCommand, {
            url: validInput.url,
            prompt: validInput.prompt,
            imageAnalysisResult: validImageAnalysisResult,
          })
        )
      })

      it('AND it should return the created image', async () => {
        expect(await promise).toBe(newImage)
      })
    })
  })
})
