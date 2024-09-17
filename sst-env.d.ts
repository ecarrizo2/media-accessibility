/* tslint:disable */
/* eslint-disable */
import 'sst'
declare module 'sst' {
  export interface Resource {
    Api: {
      type: 'sst.aws.ApiGatewayV2'
      url: string
    }
    ImageDynamo: {
      name: string
      type: 'sst.aws.Dynamo'
    }
    JobDynamo: {
      name: string
      type: 'sst.aws.Dynamo'
    }
    OpenaiApiKey: {
      type: 'sst.sst.Secret'
      value: string
    }
    ProcessImageDeadLetterQueue: {
      type: 'sst.aws.Queue'
      url: string
    }
    ProcessImageQueue: {
      type: 'sst.aws.Queue'
      url: string
    }
  }
}
export {}
