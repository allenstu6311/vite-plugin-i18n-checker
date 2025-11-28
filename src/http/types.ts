import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

type MiddlewareResult<T = any> = T | Promise<T>;

type Middleware<T = any> = (
    config: AxiosRequestConfig<T>,
    response: T
) => MiddlewareResult;

type ApiResponseTypes<T = any> = {
    success: boolean;
    data: T;
    error?: any;
}

type ApiResponseMetaTypes<T = any> = {
    retry?: number;
    middleware?: Middleware[];
    onSuccess?: (response: AxiosResponse<T>) => void;
    onError?: (error: AxiosError<T>) => void
}

export { ApiResponseMetaTypes, ApiResponseTypes, Middleware, MiddlewareResult };

