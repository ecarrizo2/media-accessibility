//
// import { z } from 'zod'
// import { createMock } from '@golevelup/ts-jest'
// import { LoggerService } from '@shared/logger.service'
//
// describe('RequestValidatorService', () => {
//   let service: RequestValidatorService
//   const logger = createMock<LoggerService>()
//
//   beforeEach(() => {
//     service = new RequestValidatorService(logger)
//   })
//
//   afterEach(jest.resetAllMocks)
//   const schema = z.object({
//     name: z.string(),
//     age: z.number(),
//   })
//
//   describe('validate', () => {
//     describe('WHEN data validation is successful', () => {
//       it('SHOULD return parsed data', () => {
//         const data = { name: 'John', age: 30 }
//         const result = service.validate(data, schema)
//
//         expect(result).toEqual(data)
//       })
//     })
//
//     describe('WHEN data validation fails', () => {
//       it('throw a 400 error', async () => {
//         const data = { name: 'John', age: 'thirty' }
//         await expect(async () => service.validate(data as any, schema)).rejects.toEqual({
//           statusCode: 400,
//           body: expect.any(String),
//         })
//       })
//     })
//   })
// })
