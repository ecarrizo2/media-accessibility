/// <reference path="./.sst/platform/config.d.ts" />

const environment = {
  LOG_LEVEL: 'debug',
}

const getImageDynamo = () => {
  return new sst.aws.Dynamo('ImageDynamo', {
    fields: {
      id: 'string',
      imageUrl: 'string',
    },
    primaryIndex: { hashKey: 'id' },
    globalIndexes: {
      ImageUrlIndex: { hashKey: 'imageUrl' },
    },
  })
}

const getJobDynamo = () => {
  return new sst.aws.Dynamo('JobDynamo', {
    fields: {
      id: 'string',
    },
    primaryIndex: { hashKey: 'id' },
  })
}

// const getSpeechDynamo = () => {
//   return new sst.aws.Dynamo('SpeechDynamo', {
//     fields: {
//       id: 'string',
//       textHash: 'string',
//     },
//     primaryIndex: { hashKey: 'id', },
//     globalIndexes: {
//       TextHashIndex: { hashKey: 'textHash', rangeKey: 'id' },
//     },
//   })
// }

const getProcessImageJobQueue = (...args: any[]) => {
  const deadLetterQueue = new sst.aws.Queue('ProcessImageDeadLetterQueue')
  const queue = new sst.aws.Queue('ProcessImageQueue', {
    dlq: {
      queue: deadLetterQueue.arn,
      retry: 5,
    },
  })

  queue.subscribe(
    {
      handler: 'src/interfaces/queue/subscriber/process-image-job-subscriber.handle',
      link: [...args],
    },
    {
      batch: {
        partialResponses: true,
        size: 1,
      },
    }
  )

  return queue
}

export default $config({
  app(input) {
    return {
      name: 'media-accessibility-ia-converter',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    }
  },

  async run() {
    const openaiApiKey = new sst.Secret('OpenaiApiKey')
    const imageDynamo = getImageDynamo()
    const jobDynamo = getJobDynamo()

    const processImageQueue = getProcessImageJobQueue(openaiApiKey, jobDynamo, imageDynamo)

    const api = new sst.aws.ApiGatewayV2('Api')
    api.route('POST /process-image', {
      handler: 'src/interfaces/http/handlers/process-image-request-handler.handle',
      link: [jobDynamo, processImageQueue],
      environment,
    })
  },
})
