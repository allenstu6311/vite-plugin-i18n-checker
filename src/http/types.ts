import { AxiosRequestConfig } from "axios";

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

type ApiResponseMetaTypes = {
    retry?: number;
    middleware?: Middleware[];
}

export { ApiResponseMetaTypes, ApiResponseTypes, Middleware, MiddlewareResult };

