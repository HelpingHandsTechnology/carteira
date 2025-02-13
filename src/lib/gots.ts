export type AppResult<TData, TError> = readonly [TData, TError]
export function ok<TData, TError>(data: TData): AppResult<TData, TError> {
  return [data, undefined as never] as const
}
export function err<TData, TError>(error: TError): AppResult<TData, TError> {
  return [undefined as never, error] as const
}

export async function fromPromise<TData, TError>(
  promise: Promise<TData>,
  errorHandler: (error: unknown) => TError
): Promise<AppResult<TData, TError>> {
  try {
    const data = await promise
    return ok(data)
  } catch (error) {
    return err(errorHandler(error))
  }
}
