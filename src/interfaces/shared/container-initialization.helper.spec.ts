import { initializeRequestContainer, initializeQueueContainer } from './container-initialization.helper'
import { container } from 'tsyringe'

describe('Container Initialization', () => {
  beforeEach(() => {
    container.clearInstances()
  })

  describe('initializeRequestContainer', () => {
    const getMockEvent = (traceId: string | null) => {
      return {
        requestContext: {
          requestId: 'mockRequestId',
        },
        headers: { 'X-Internal-Trace-Id': traceId },
      } as unknown as AWSLambda.APIGatewayEvent
    }

    const dataProvider = [getMockEvent('mockTraceId'), getMockEvent(null)]
    it.each(dataProvider)('should not throw an error', (mockEvent) => {
      expect(() => initializeRequestContainer(mockEvent)).not.toThrow()
    })
  })

  describe('initializeQueueContainer', () => {
    const getMockRecord = (traceId: string | null) => {
      return {
        messageId: 'mockMessageId',
        body: JSON.stringify({ traceId }),
      } as AWSLambda.SQSRecord
    }

    const dataProvider = [getMockRecord('mockTraceId'), getMockRecord(null)]

    it.each(dataProvider)('should not throw an error', (mockRecord) => {
      expect(() => initializeQueueContainer(mockRecord)).not.toThrow()
    })
  })
})
