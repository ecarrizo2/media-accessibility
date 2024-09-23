// import { RequestErrorHandlerWrapperService } from './request-error-handler-wrapper-service'
// import { createMock } from '@golevelup/ts-jest'
// import { LoggerService } from '@shared/logger/logger.service'
//
// describe('ActionWrapperService', () => {
//   describe('execute', () => {
//     let service: RequestErrorHandlerWrapperService
//     const logger = createMock<LoggerService>()
//
//     beforeEach(() => {
//       service = new RequestErrorHandlerWrapperService(logger)
//     })
//
//     afterEach(jest.resetAllMocks)
//
//     describe('WHEN the action is successful', () => {
//       it('SHOULD return the result of the action', async () => {
//         const argument1 = 'argument1'
//         const argument2 = 'argument2'
//         const action = jest.fn().mockResolvedValue('result')
//
//         const result = await service.execute(action, argument1, argument2)
//
//         expect(result).toEqual('result')
//         expect(action).toHaveBeenCalledTimes(1)
//         expect(action).toHaveBeenCalledWith(argument1, argument2)
//       })
//     })
//
//     describe('WHEN the action throws an error', () => {
//       it('SHOULD log the error and return a 500 status code', async () => {
//         const action = jest.fn().mockRejectedValue(new Error('error'))
//         await expect(service.execute(action)).rejects.toEqual({
//           statusCode: 500,
//           body: JSON.stringify({
//             error: 'error',
//           }),
//         })
//       })
//     })
//   })
// })
