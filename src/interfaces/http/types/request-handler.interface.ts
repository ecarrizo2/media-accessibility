export interface RequestHandler {
  handle: (resolvingPromise: Promise<unknown>) => Promise<unknown>
}
