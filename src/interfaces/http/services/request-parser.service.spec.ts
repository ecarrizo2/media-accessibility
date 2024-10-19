import { RequestParserService } from '@interfaces/http/services/request-parser.service'
import { IsString } from 'class-validator'
import { LoggerService } from '@shared/logger/logger.service'
import { createMock } from '@golevelup/ts-jest'

interface Test {
  field: string
}

class TestDTO implements Test {
  @IsString()
  field!: string
}

describe('RequestParserService', () => {
  let requestParserService: RequestParserService<TestDTO, Test>
  const logger = createMock<LoggerService>()

  beforeEach(() => {
    requestParserService = new RequestParserService<TestDTO, Test>(logger)
  })

  afterEach(jest.resetAllMocks)

  describe('WHEN converting raw request into DTO', () => {
    describe('AND the DTO Instantiation is valid (Request validation passes)', () => {
      it('THEN it should convert the raw request into DTO', async () => {
        const data = { field: 'test' }
        const result = await requestParserService.parse(data, TestDTO)
        console.log(result)
        console.log('------')

        expect(result).toEqual({ field: 'test' })
        expect(result).toBeInstanceOf(TestDTO)
      })
    })
  })
})
