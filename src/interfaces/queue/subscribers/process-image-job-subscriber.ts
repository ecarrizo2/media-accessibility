import 'reflect-metadata'
import { container } from 'tsyringe'
import { initializeQueueContainer } from '@interfaces/shared/container-initialization.helper'
import { BaseError } from '@shared/errors/base.error'
import { ProcessImageJobService } from '@interfaces/queue/services/process-image-job.service'
import { LoggerService } from '@shared/logger/logger.service'
import { ProcessImageJobRecordData } from '@interfaces/queue/sqs-event.interface'

/**
 * Handle events of the Process Image Queue, this Queue and its handler is used to process SQS messages
 * The Queue messages will be processed one by one instead of using batch operations
 *
 * @param {AWSLambda.SQSEvent} event - The SQS event to be processed.
 * @returns {Promise<AWSLambda.SQSBatchResponse>} A promise that resolves when event is processed, indicating if the event failed or not.
 */
export const handle = async (event: AWSLambda.SQSEvent): Promise<AWSLambda.SQSBatchResponse> => {
  const record = event.Records[0]
  initializeQueueContainer(record)
  const logger = container.resolve(LoggerService)
  const processImageJobService = container.resolve(ProcessImageJobService)
  const body = JSON.parse(record.body) as ProcessImageJobRecordData

  try {
    await processImageJobService.performJobProcessing(body)
    return { batchItemFailures: [] }
  } catch (error) {
    logger.error(error)
    const customInstance = error instanceof BaseError
    const isReprocessable = customInstance && !error.nonReprocessable
    const isNotCustomError = !customInstance

    if (isReprocessable || isNotCustomError) {
      logger.debug(`Message is reprocessable, making it visible again`, { messageId: record.messageId })
      return { batchItemFailures: [{ itemIdentifier: record.messageId }] }
    }
  }

  return { batchItemFailures: [] }
}
