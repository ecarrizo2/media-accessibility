import { ProcessImageRequestInputDto } from '@domain/value-objects/image/process-image-request-input.vo'

export interface BaseSQSRecordBody {
  traceId?: string
}

export interface JobSQSRecordBody extends BaseSQSRecordBody {
  jobId: string
}

export interface ProcessImageJobRecordData extends JobSQSRecordBody {
  input: ProcessImageRequestInputDto
}
