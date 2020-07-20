import { Observable, combineLatest, defer, timer, throwError, iif, forkJoin } from 'rxjs';
import { map, retryWhen, concatMap, tap, startWith, catchError } from 'rxjs/operators';
import { RetryBackoffConfig, exponentialBackoffDelay, getDelay, ApiResponse } from './operators.helper';
import { HttpResponse } from '@angular/common/http';

export class OperatorUtils {
  public static vmFromLatest<TVm extends {}, TComputedVm extends {} = any>(
    vmBase: { [K in keyof TVm]: Observable<TVm[K]> },
    manipulateFunction?: (vmBaseReturn: TVm) => TComputedVm
  ): Observable<TVm & TComputedVm> {
    return combineLatest(Object.values(vmBase)).pipe(
      map((responses) => {
        const returnVm = Object.keys(vmBase).reduce((vm, key, index) => {
          vm[key] = responses[index];
          return vm;
        }, {} as TVm);

        if (manipulateFunction) {
          const manipulatedVm = manipulateFunction(returnVm);
          return Object.assign(returnVm, manipulatedVm) as TVm & TComputedVm;
        }
        return returnVm as TVm & TComputedVm;
      })
    );
  }

  public static getApiResponse<T = any>(apiCall: Observable<T>): Observable<ApiResponse<T>> {
    return apiCall.pipe(
      map(data => ({ isLoading: false, data, error: '' })),
      startWith({ data: null, isLoading: true, error: '' }),
      catchError(err => {
        return throwError({ isLoading: false, data: null, error: err || 'Unexpected error' })
      }
      )
    )
  }

  public static forkJoinCustom<T = any>([...args]: Observable<T>[]) : Observable<HttpResponse<T>> {
    return forkJoin(...args);
  }

  public static retryBackoff(
    config: number | RetryBackoffConfig
  ): <T>(source: Observable<T>) => Observable<T> {
    const {
      initialInterval,
      maxRetries = Infinity,
      maxInterval = Infinity,
      shouldRetry = () => true,
      resetOnSuccess = false,
      backoffDelay = exponentialBackoffDelay,
    } = typeof config === 'number' ? { initialInterval: config } : config;
    return <T>(source: Observable<T>) =>
      defer(() => {
        let index = 0;
        return source.pipe(
          retryWhen<T>(errors =>
            errors.pipe(
              concatMap(error => {
                const attempt = index++;
                return iif(
                  () => attempt < maxRetries && shouldRetry(error),
                  timer(
                    getDelay(backoffDelay(attempt, initialInterval), maxInterval)
                  ),
                  throwError(error)
                );
              })
            )
          ),
          tap(() => {
            if (resetOnSuccess) {
              index = 0;
            }
          })
        );
      });
  }
}

