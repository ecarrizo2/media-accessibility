import { ProcessImageCommandProps } from '@application/commands/image/process-image.command'

export interface BaseSQSRecordBody {
  traceId?: string
}

export interface JobSQSRecordBody extends BaseSQSRecordBody {
  jobId: string
}

export interface ProcessImageJobRecordData extends JobSQSRecordBody {
  command: ProcessImageCommandProps
}
