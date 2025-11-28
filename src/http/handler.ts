import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { generateErrorMessage } from "./code";
import { ApiResponseMetaTypes, ApiResponseTypes, MiddlewareResult } from "./types";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function applyMiddleware<T = any>(response: AxiosResponse<T>, meta?: ApiResponseMetaTypes): Promise<MiddlewareResult<T>> {

    if (meta?.middleware) {
        const { config, data } = response;
        let result: MiddlewareResult<T> = data;
        for (const middleware of meta.middleware) {
            result = await middleware(config, data);
            if (result instanceof Promise) {
                await result;
            }
        }
        return result;
    }
    return response.data;
}

async function handleSuccessResponse<T = any>(response: AxiosResponse<T>, meta?: ApiResponseMetaTypes): Promise<ApiResponseTypes<T>> {
    const data = await applyMiddleware(response, meta);
    const { onSuccess } = meta || {};
    if (onSuccess) {
        onSuccess(response);
    }
    return {
        success: true,
        data,
    };
}


async function handleErrorResponse<T = any>(error: any,
    ctx: {
        url: string,
        body: any,
        meta?: ApiResponseMetaTypes,
        config?: AxiosRequestConfig,
        instance: AxiosInstance
    }): Promise<ApiResponseTypes<T | null>> {
    const { instance, meta, url, body, config } = ctx;
    const { retry, onError } = meta || {};
    const { method } = (error as AxiosError<any, any>)?.config || {};

    let retryLeft = retry || 0;
    let lastError: any = error;

    while (retryLeft > 0) {
        let response: ApiResponseTypes<T> = {
            success: false,
            data: {} as T,
            error: undefined,
        };

        try {
            switch (method) {
                case 'get':
                    response = await instance.get(url, config);
                    break;
                case 'post':
                    response = await instance.post(url, body, config);
                    break;
            }
            if (response.success) {
                return response;
            } else {
                retryLeft--;
                lastError = error;

                const { url, method, code, message, status } = lastError;
                console.log(
                    `✖  Retry ${retryLeft}/${retry} — ${method?.toUpperCase()} ${url} (${code ?? "N/A"} ${status ?? ""})`
                );
                console.log(
                    `    Message: ${message}`
                );
            }


        } catch (error) {
            console.log('catch error', error);
            retryLeft--;
            lastError = error;

            const { url, method, code, message, status } = lastError;
            console.log(
                `✖  Retry ${retryLeft}/${retry} — ${method?.toUpperCase()} ${url} (${code ?? "N/A"} ${status ?? ""})`
            );

            console.log(
                `    Message: ${message}`
            );
        }
        await sleep(2000);
    }

    if (onError) {
        onError(lastError);
    } else {
        generateErrorMessage(lastError);
    }
    return {
        success: false, data: null, error: lastError,
    };
}


export { handleErrorResponse, handleSuccessResponse };

