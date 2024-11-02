import { RequestParserService } from '@interfaces/http/services/request-parser.service'
import { IsString } from 'class-validator'
import { LoggerService } from '@shared/logger/logger.service'
import { createMock } from '@golevelup/ts-jest'
import { Exclude, Expose } from 'class-transformer'

interface Test {
  field: string
}

@Exclude()
class TestDTO implements Test {
  @IsString()
  @Expose()
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

        expect(result).toEqual({ field: 'test' })
        expect(result).toBeInstanceOf(TestDTO)
      })
    })
  })
})
