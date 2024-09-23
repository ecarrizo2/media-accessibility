/// <reference path="./.sst/platform/config.d.ts" />

const environment = {
  LOG_LEVEL: 'debug',
}

const getImageMetadataDynamo = () => {
  return new sst.aws.Dynamo('ImageMetadataDynamo', {
    fields: {
      id: 'string',
      imageUrl: 'string',
    },
    primaryIndex: { hashKey: 'id', rangeKey: 'imageUrl' },
    globalIndexes: {
      ImageUrlIndex: { hashKey: 'imageUrl', rangeKey: 'id' },
    },
  })
}

const getSpeechDynamo = () => {
  return new sst.aws.Dynamo('SpeechDynamo', {
    fields: {
      id: 'string',
      textHash: 'string',
    },
    primaryIndex: { hashKey: 'id', rangeKey: 'textHash' },
    globalIndexes: {
      TextHashIndex: { hashKey: 'textHash', rangeKey: 'id' },
    },
  })
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
    const imageMetadataDynamo = getImageMetadataDynamo()
    const speechDynamo = getSpeechDynamo()
    const openaiApiKey = new sst.Secret('OpenaiApiKey')
    const bucket = new sst.aws.Bucket('SpeechBucket', {
      public: true,
    })

    const api = new sst.aws.ApiGatewayV2('Api')
    api.route('POST /process-image', {
      handler: 'src/application/handlers/process-image.handler',
      link: [imageMetadataDynamo, speechDynamo, bucket, openaiApiKey],
      environment,
    })

    api.route('POST /process-text', {
      handler: 'src/application/handlers/process-text.handler',
    })
  },
})
