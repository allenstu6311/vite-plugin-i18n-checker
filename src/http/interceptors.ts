import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { handleErrorResponse, handleSuccessResponse } from "./handler";
import { ApiResponseMetaTypes, ApiResponseTypes } from "./types";

const defaultConfig: AxiosRequestConfig = {
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
};

function parseResponseError(error: any) {
    if (error.code === "ECONNABORTED") {
        const { url, method } = error?.config || {};

        return {
            type: "TIMEOUT",
            status: "TIMEOUT",
            statusText: error.code,
            message: error.message,
            url,
            method,
            code: error.code,
        };
    }

    const res = error?.response || {};
    const { data } = res || {};
    const { url, method } = res?.config || {};
    const { code, message, status } = data?.error || {};

    return {
        type: "API_ERROR",
        code,
        status,
        // statusText: res.statusText,
        message: message,
        method,
        url
    };
}

function parseRequestError(error: any) {
    const code = error.code || "UNKNOWN";
    const message = error.message || "Network error occurred.";

    // Timeout
    if (code === "ECONNABORTED") {
        return {
            type: "TIMEOUT",
            status: null,
            statusText: code,
            message,
        };
    }

    // DNS errors (domain resolve failures)
    if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
        return {
            type: "DNS_ERROR",
            status: null,
            statusText: code,
            message,
        };
    }

    // Connection reset / forcibly closed by server
    if (code === "ECONNRESET") {
        return {
            type: "CONNECTION_ERROR",
            status: null,
            statusText: code,
            message,
        };
    }

    // SSL / certificate issues
    if (
        code === "DEPTH_ZERO_SELF_SIGNED_CERT" ||
        code === "ERR_TLS_CERT_ALTNAME_INVALID" ||
        code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE"
    ) {
        return {
            type: "SSL_ERROR",
            status: null,
            statusText: code,
            message,
        };
    }

    // Other network-level errors
    return {
        type: "UNKNOWN_NETWORK_ERROR",
        status: null,
        statusText: code,
        message,
    };
}


class HttpInstance {
    public instance: AxiosInstance;

    constructor(config?: AxiosRequestConfig) {
        this.instance = axios.create({ ...defaultConfig, ...config });
        this.instance.interceptors.request.use(function (config) {
            return config;
        }, function (error) {
            return Promise.reject(parseRequestError(error));
        });
        this.instance.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            return Promise.reject(parseResponseError(error));
        });
    }
}

const instance = new HttpInstance().instance;

function createAxiosInstance(instance: AxiosInstance) {
    async function get<T = any>(
        url: string,
        config?: AxiosRequestConfig,
        meta?: ApiResponseMetaTypes
    ): Promise<ApiResponseTypes<T | null>> {
        try {
            const response = await instance.get(url, config);
            return handleSuccessResponse<T>(response, meta);
        } catch (error) {
            return handleErrorResponse<T>(error, { url, body: undefined, meta, config, instance });
        }
    }

    async function post<T = any>(
        url: string,
        body: any,
        config?: AxiosRequestConfig,
        meta?: ApiResponseMetaTypes
    ): Promise<ApiResponseTypes<T | null>> {
        try {
            const response = await instance.post(url, body, config);
            return handleSuccessResponse<T>(response, meta);
        } catch (error) {
            return handleErrorResponse<T>(error, { url, body, meta, config, instance });
        }
    }

    return { get, post };
}

const http = createAxiosInstance(instance);


export { http };

