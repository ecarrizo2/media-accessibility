import { HttpStatusCode } from '@interfaces/http/types/http-status-code.enum'

export interface Response {
  status: HttpStatusCode
  body: unknown
}

export interface BadRequestResponse extends Response {
  status: HttpStatusCode.BAD_REQUEST
  body: {
    message: string
    errors?: {
      field: string
      message: string
    }[]
  }
}

export interface InternalServerErrorResponse extends Response {
  status: HttpStatusCode.INTERNAL_SERVER_ERROR
  body: {
    message: string
  }
}
