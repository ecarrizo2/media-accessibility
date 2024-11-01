import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { inject, injectable } from 'tsyringe'
import { LoggerService } from '@shared/logger/logger.service'
import { Logger } from '@shared/logger/logger.interface'

@injectable()
export class SQSClientService {
  protected client = new SQSClient({})

  constructor(@inject(LoggerService) private readonly logger: Logger) {}

  async send(queueUrl: string, messageBody: Record<string, unknown>): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({
        ...messageBody,
        traceId: this.logger.getTraceId(),
      }),
    })

    await this.client.send(command)
  }
}
