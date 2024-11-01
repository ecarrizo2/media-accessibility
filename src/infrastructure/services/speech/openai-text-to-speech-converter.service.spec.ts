import { OpenaiTextToSpeechConverterService } from '@infrastructure/services/speech/openai-text-to-speech-converter.service'
import { createMock } from '@golevelup/ts-jest'
import { LoggerService } from '@shared/logger/logger.service'
import { S3ClientService } from '@infrastructure/services/aws/s3-client.service'
import { Speech } from '@infrastructure/services/speech/text-to-speech-converter.interface'
import { SpeechVO } from '@domain/value-objects/speech/speech.vo'
import OpenAI from 'openai'
import { mockedUuid } from '../../../../jest.setup'
import { instanceToPlain } from 'class-transformer'

describe('OpenaiTextToSpeechConverterService', () => {
  it('should be defined', () => {
    expect(OpenaiTextToSpeechConverterService).toBeDefined()
  })

  const openaiMock = createMock<OpenAI>()
  const logger = createMock<LoggerService>()
  const s3Client = createMock<S3ClientService>()

  const getInstance = () => {
    const instance = new OpenaiTextToSpeechConverterService(logger, s3Client)
    instance.openai = openaiMock
    return instance
  }

  describe('(Happy Path) - Given valid text and voice parameters', () => {
    let result: Speech
    const textInput = 'Hello, World!'
    const response = new Response()
    let buffer: Buffer

    beforeAll(async () => {
      buffer = Buffer.from(await response.arrayBuffer())
      jest.spyOn(openaiMock.audio.speech, 'create').mockResolvedValue(response)
      result = await getInstance().convertTextToSpeech('Hello, World!', {})
    })

    afterAll(jest.resetAllMocks)

    it('THEN should have called the OpenAI Client to get the speech file created', () => {
      expect(openaiMock.audio.speech.create).toHaveBeenCalledTimes(1)
      expect(openaiMock.audio.speech.create).toHaveBeenCalledWith({
        model: 'tts-1',
        voice: 'alloy',
        input: textInput,
      })
    })

    it('AND should have called the S3 Client to get the speech uploaded', () => {
      expect(s3Client.send).toHaveBeenCalledTimes(1)
      expect(s3Client.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Bucket: 'mocked-bucket-name',
            Key: mockedUuid,
            Body: buffer,
            ContentType: 'audio/mpeg',
          },
        })
      )
    })

    it('AND Should have returned a Speech object', () => {
      expect(result).toBeInstanceOf(SpeechVO)
      expect(instanceToPlain(result)).toEqual(
        expect.objectContaining({
          id: mockedUuid,
          text: textInput,
          speechUrl: `https://mocked-bucket-name.s3.amazonaws.com/${mockedUuid}`,
        })
      )
    })
  })
})
