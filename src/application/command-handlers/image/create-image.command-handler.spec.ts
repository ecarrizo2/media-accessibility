import { createMock } from '@golevelup/ts-jest'
import { CreateImageCommandHandler } from './create-image.command-handler'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'
import { createCreateImageCommandMock } from '../../../../test/mocks/create-image.command.mock'
import { ImageEntity } from '@domain/entities/image/image.entity'
import { Logger } from '@shared/logger/logger.interface'

describe('AnalyseImageCommandHandler', () => {
  let commandHandler: CreateImageCommandHandler
  const repository = createMock<ImageRepository>()
  const logger = createMock<Logger>()

  beforeEach(() => {
    commandHandler = new CreateImageCommandHandler(repository, logger)
  })

  describe('WHEN handling the command', () => {
    it('THEN it should invoke the image analyser and return the result', async () => {
      const command = createCreateImageCommandMock({
        url: 'http://example.com/image.jpg',
        prompt: 'Describe the image',
        imageAnalysisResult: {
          text: 'Description of the image',
          vendor: 'OpenAI',
          raw: '{}',
        },
      })

      const unitResult = await commandHandler.handle(command)

      expect(repository.save).toHaveBeenCalledTimes(1)
      expect(repository.save).toHaveBeenCalledWith(expect.any(ImageEntity))
      expect(unitResult).toBeInstanceOf(ImageEntity)
      expect(unitResult).toEqual(
        expect.objectContaining({
          url: command.url,
          prompt: command.prompt,
          analysisText: command.imageAnalysisResult.text,
          analysisVendor: command.imageAnalysisResult.vendor,
          analysisResultRaw: command.imageAnalysisResult.raw,
        })
      )
    })
  })
})
