/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Api: {
      type: "sst.aws.ApiGatewayV2"
      url: string
    }
    ImageMetadataDynamo: {
      name: string
      type: "sst.aws.Dynamo"
    }
    OpenaiApiKey: {
      type: "sst.sst.Secret"
      value: string
    }
    SpeechBucket: {
      name: string
      type: "sst.aws.Bucket"
    }
    SpeechDynamo: {
      name: string
      type: "sst.aws.Dynamo"
    }
  }
}
export {}