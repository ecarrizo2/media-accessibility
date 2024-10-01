import { AnalyseImageCommandHandler } from '@application/command-handlers/image/analyse-image.command-handler'
import { OpenAIImageAnalyserService } from '@infrastructure/services/image/openai-image-analyser.service'
import { AnalyseImageCommand } from '@application/commands/image/analyse-image.command'
import { createMock } from '@golevelup/ts-jest'
import { createImageAnalysisResultMock } from '../../../../test/mocks/image-analysis-result.vo.mock'

describe('AnalyseImageCommandHandler', () => {
  let commandHandler: AnalyseImageCommandHandler
  const imageAnalyserService = createMock<OpenAIImageAnalyserService>()

  beforeEach(() => {
    commandHandler = new AnalyseImageCommandHandler(imageAnalyserService)
  })

  describe('WHEN handling the command', () => {
    it('THEN it should invoke the image analyser and return the result', async () => {
      const imageAnalysisResult = createImageAnalysisResultMock()
      imageAnalyserService.analyseImage.mockResolvedValue(imageAnalysisResult)

      const command = await AnalyseImageCommand.from({
        url: 'http://localhost:8080',
        prompt: 'Describe this image in 5 words',
      })

      const unitResult = await commandHandler.handle(command)
      expect(unitResult).toEqual(imageAnalysisResult)
    })
  })
})
