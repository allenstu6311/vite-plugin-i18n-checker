import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { handleErrorResponse, handleSuccessResponse } from "./handler";
import { ApiResponseMetaTypes, ApiResponseTypes } from "./types";

const defaultConfig: AxiosRequestConfig = {
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
};
class HttpInstance {
    public instance: AxiosInstance;

    constructor(config?: AxiosRequestConfig) {
        this.instance = axios.create({ ...defaultConfig, ...config });
        this.instance.interceptors.request.use(function (config) {
            return config;
        }, function (error) {
            return Promise.reject(error);
        });
        this.instance.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            return Promise.reject(error);
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

