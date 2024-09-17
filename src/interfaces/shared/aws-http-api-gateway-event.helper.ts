export const getEventBody = (event: AWSLambda.APIGatewayEvent) => {
  return JSON.parse(event.body || '{}')
}

export const getEventHeaders = (event: AWSLambda.APIGatewayEvent) => {
  return event.headers || {}
}

export const getEventHeaderByKey = (event: AWSLambda.APIGatewayEvent, key: string) => {
  const headers = getEventHeaders(event)
  return headers[key] ?? undefined
}
