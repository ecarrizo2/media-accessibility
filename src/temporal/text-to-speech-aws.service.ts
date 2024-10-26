import { inject, injectable } from 'tsyringe'
import { v4 as uuidv4 } from 'uuid'
import { StartSpeechSynthesisTaskCommand, PollyClient, VoiceId } from '@aws-sdk/client-polly'
import { Resource } from 'sst'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'


const pollyClient = new PollyClient({
  region: process.env.AWS_REGION, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
})

@injectable()
export class TextToSpeechAWSService {
  constructor(
    @inject(LoggerService) private readonly logger: Logger
  ) {}

  async processText(text: string, voice: VoiceId): Promise<any> {
    this.logger.debug('processText()')
    this.logger.debug('TEXT', { text })

    const id = uuidv4()
    const bucketName = Resource.SpeechBucket.name

    try {
      // Start the speech synthesis task and save the result directly to S3
      const synthesizeTaskCommand = new StartSpeechSynthesisTaskCommand({
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: voice,
        Engine: 'neural', // Use neural voices for high-quality output
        LanguageCode: 'es-MX',
        OutputS3BucketName: bucketName,
        OutputS3KeyPrefix: `polly/${id}/`, // Optional prefix to organize files
      })

      const response = await pollyClient.send(synthesizeTaskCommand)

      if (!response.SynthesisTask) throw new Error('SynthesisTask not found in Polly response')

      const s3Key = response.SynthesisTask.OutputUri

      const speechData = {
        id,
        text,
        speechUrl: s3Key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log(`File is being generated. S3 Object URL: ${s3Key}`)
      return speechData
    } catch (err) {
      console.error('Error processing text-to-speech:', err)
      throw err
    }
  }
}
