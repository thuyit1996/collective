
export function getDelay(backoffDelay: number, maxInterval: number) {
  return Math.min(backoffDelay, maxInterval);
}

export function exponentialBackoffDelay(
  iteration: number, initialInterval: number) {
  return Math.pow(2, iteration) * initialInterval;
}

export interface RetryBackoffConfig {
  initialInterval: number;
  maxRetries?: number;
  maxInterval?: number;
  resetOnSuccess?: boolean;
  shouldRetry?: (error: any) => boolean;
  backoffDelay?: (iteration: number, initialInterval: number) => number;
}

export interface ApiResponse<T> {
  data: T,
  isLoading: boolean,
  error: string,
}