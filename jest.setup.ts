import 'reflect-metadata'

// Create a mock for the Resource class
jest.mock('sst', () => {
  return {
    Resource: {
      OpenaiApiKey: {
        value: 'mocked-api-key',
      },
      ProcessImageQueue: {
        url: 'https://sqs.us-east-1.amazonaws.com/123456789012/ProcessImageQueue',
      },
    },
  }
})

// New Date() always return the same date.
const mockDate = new Date(2024, 0, 1)
export const mockedIsoStringDate = mockDate.toISOString()
jest.spyOn(global, 'Date').mockImplementation(() => mockDate)

// V4() always return the same UUID.
export const mockedUuid = '00000000-0000-0000-0000-000000000000'
jest.mock('uuid', () => ({
  v4: () => mockedUuid,
}))
