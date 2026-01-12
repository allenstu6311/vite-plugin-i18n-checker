import { AIProvider } from "../../types";
import { PROVIDER_REGISTRY } from "../provider";

function parseResponseError(error: any, provider: AIProvider) {
    const res = error?.response;
    if (res) {
        const errorInfo = PROVIDER_REGISTRY[provider]?.getError(error);
        if (errorInfo) return errorInfo;
    }

    if (error.code) {
        const { url, method } = error?.config || {};

        const networkErrors = [
            "ECONNABORTED",   // axios timeout
            "ETIMEDOUT",      // socket timeout
            "ENOTFOUND",      // DNS lookup fail
            "EAI_AGAIN",      // DNS temp fail
            "ECONNRESET",     // server reset connection
            "ECONNREFUSED",   // server refused
        ];

        if (networkErrors.includes(error.code)) {
            return {
                type: "NETWORK_ERROR",
                status: "NETWORK_ERROR",
                message: error.message,
                url,
                method,
                code: error.code,
            };
        }
    }

    return {
        type: "UNKNOWN_ERROR",
        status: "UNKNOWN_ERROR",
        message: error.message,
        url: error.config?.url || '',
        method: error.config?.method || '',
        code: error.code,
    };
}

export { parseResponseError };

