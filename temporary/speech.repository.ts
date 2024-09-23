import { inject, injectable } from 'tsyringe'
import { DynamoDBDocumentClient, PutCommand, QueryCommand, QueryCommandOutput } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Resource } from 'sst'
import crypto from 'crypto'
import { SpeechEntity } from './speech.entity'
import { Logger } from '../src/shared/logger/logger.interface'
import { LoggerService } from '../src/shared/logger/logger.service'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))

@injectable()
export class SpeechRepository {
  constructor(@inject(LoggerService) private readonly logger: Logger) {}

  async getSpeech(text: string): Promise<SpeechEntity | null> {
    this.logger.debug('getSpeech()')

    const hash = crypto.createHash('sha256').update(text).digest('hex')
    const queryCommandParams = {
      TableName: Resource.SpeechDynamo.name,
      IndexName: 'TextHashIndex',
      KeyConditionExpression: 'textHash = :textHash',
      ExpressionAttributeValues: {
        ':textHash': hash,
      },
      Limit: 1,
    }

    this.logger.debug('Running query', queryCommandParams)
    const result: QueryCommandOutput = await client.send(new QueryCommand(queryCommandParams))
    this.logger.debug('/getSpeech()')

    return result?.Items?.length ? (result?.Items[0] as unknown as SpeechEntity) : null
  }

  async saveSpeech(speech: SpeechEntity): Promise<SpeechEntity> {
    await client.send(
      new PutCommand({
        TableName: Resource.SpeechDynamo.name,
        Item: speech,
      })
    )

    return speech
  }
}
