export interface RegisterJobErrorCommand {
  jobId: string
  error: Error | unknown
}
