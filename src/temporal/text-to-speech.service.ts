import { inject, injectable } from 'tsyringe'

const { v4: uuidv4 } = require('uuid')
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Resource } from 'sst'
import OpenAI from 'openai'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
})

const s3Client = new S3Client({})

@injectable()
export class TextToSpeechService {
  constructor(
    @inject(LoggerService) private readonly logger: Logger
  ) {}

  async processText(text: string): Promise<any> {
    this.logger.debug('processText()')

    const id = uuidv4()
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())
    const bucketName = Resource.SpeechBucket.name
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: id,
      Body: buffer,
      ContentType: 'audio/mpeg', // Set the content type as MP3
    })

    try {
      // Upload the file to S3
      await s3Client.send(command)
      console.log(`File uploaded successfully. S3 Object URL: https://${bucketName}.s3.amazonaws.com/${id}`)
    } catch (err) {
      console.error('Error uploading file to S3:', err)
    }

    const speechData = {
      id,
      text,
      speechUrl: `https://${bucketName}.s3.amazonaws.com/${id}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return speechData
  }
}