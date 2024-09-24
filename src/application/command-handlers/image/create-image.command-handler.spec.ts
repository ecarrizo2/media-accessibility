import { createMock } from '@golevelup/ts-jest'
import { CreateImageCommandHandler } from './create-image.command-handler'
import { ImageRepository } from '@domain/repositories/image/image-repository.interface'
import { createCreateImageCommandMock } from '../../../../test/mocks/create-image.command.mock'
import { ImageEntity } from '@domain/entities/image/image.entity'

describe('AnalyseImageCommandHandler', () => {
  let commandHandler: CreateImageCommandHandler
  const repository = createMock<ImageRepository>()

  beforeEach(() => {
    commandHandler = new CreateImageCommandHandler(repository)
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

      const expectedImage = new ImageEntity({
        id: '1234-1234-1234-1234',
        url: command.url,
        prompt: command.prompt,
        analysisText: command.imageAnalysisResult.text,
        analysisVendor: command.imageAnalysisResult.vendor,
        analysisResultRaw: command.imageAnalysisResult.raw,
        createdAt: '2024-09-24 00:00:00',
      })

      const unitResult = await commandHandler.handle(command)

      expect(repository.save).toHaveBeenCalledWith(1)
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(expectedImage))
      expect(unitResult).toBeInstanceOf(ImageEntity)
      expect(unitResult).toEqual(expect.objectContaining(expectedImage))
    })
  })
})
