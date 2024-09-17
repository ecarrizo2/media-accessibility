export interface ProcessImageJobRecord extends AWSLambda.SQSRecord {
  body: {
    traceId: string
    jobId: string,
    command: {
      url: string
      prompt: string
      createSpeech?: boolean
    }
  }
}
