import { inject, injectable } from 'tsyringe'
import { v4 } from 'uuid'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { Resource } from 'sst'
import OpenAI from 'openai'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'
import {
  OpenAIVoiceParameters,
  Speech,
  TextToSpeechConverter,
} from '@infrastructure/services/speech/text-to-speech-converter.interface'
import { S3ClientService } from '@infrastructure/services/aws/s3-client.service'
import { SpeechVO } from '@domain/value-objects/speech/speech.vo'

const apiKey = Resource.OpenaiApiKey.value

@injectable()
export class OpenaiTextToSpeechConverterService implements TextToSpeechConverter<OpenAIVoiceParameters> {
  openai = new OpenAI({
    apiKey,
  })

  constructor(
    @inject(LoggerService) private readonly logger: Logger,
    @inject(S3ClientService) private readonly s3ClientService: S3ClientService
  ) {}

  async convertTextToSpeech(text: string, parameters: OpenAIVoiceParameters): Promise<Speech> {
    this.logger.debug('processText()')
    this.logger.debug('TEXT', { text })

    const id = v4()
    const speechMP3 = await this.createSpeech(text, parameters)
    const buffer = Buffer.from(await speechMP3.arrayBuffer())
    await this.uploadToS3(id, buffer)

    return this.createSpeechValueObject(id, text)
  }

  private async createSpeech(text: string, parameters: OpenAIVoiceParameters) {
    return this.openai.audio.speech.create({
      model: parameters.model ?? 'tts-1',
      voice: parameters.voice ?? 'alloy',
      input: text,
    })
  }

  private async uploadToS3(id: string, buffer: Buffer) {
    const bucketName = Resource.SpeechBucket.name
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: id,
      Body: buffer,
      ContentType: 'audio/mpeg', // Set the content type as MP3
    })

    try {
      await this.s3ClientService.send(command)
      this.logger.info(`File uploaded successfully. S3 Object URL: https://${bucketName}.s3.amazonaws.com/${id}`)
    } catch (error: unknown) {
      this.logger.error('Error uploading file to S3:', error)
      throw error
    }
  }

  private createSpeechValueObject(id: string, text: string): Promise<SpeechVO> {
    const bucketName = Resource.SpeechBucket.name
    return SpeechVO.from({
      id,
      text,
      speechUrl: `https://${bucketName}.s3.amazonaws.com/${id}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
}
