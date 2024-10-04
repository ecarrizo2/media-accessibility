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
// const mockDate = new Date(2024, 0, 1)
// export const mockedIsoStringDate = mockDate.toISOString()
// jest.spyOn(global, 'Date').mockImplementation(() => mockDate)

// V4() always return the same UUID.
export const mockedUuid = 'ca92fca6-7790-4eac-96ab-29b4b1742228'
jest.mock('uuid', () => ({
  v4: () => mockedUuid,
}))

// Deactivating logs
console.log = jest.fn()
console.info = jest.fn()
console.warn = jest.fn()
console.error = jest.fn()
console.time = jest.fn()
console.debug = jest.fn()
