import { AxiosResponse } from "axios";
import { error } from "../utils";

enum STATUS_CODE {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    INTERNAL_SERVER_ERROR = 500,
};


function getCustomErrorMessage(code: number) {
    switch (code) {
        case STATUS_CODE.SUCCESS:
            return 'Success';
        case STATUS_CODE.BAD_REQUEST:
            return 'Bad Request';
        case STATUS_CODE.UNAUTHORIZED:
            return 'Unauthorized';
        case STATUS_CODE.FORBIDDEN:
            return 'Forbidden';
        case STATUS_CODE.NOT_FOUND:
            return 'Not Found';
        case STATUS_CODE.METHOD_NOT_ALLOWED:
            return 'Method Not Allowed';
        case STATUS_CODE.INTERNAL_SERVER_ERROR:
            return 'Server Error';
        default:
            return 'Unknown Error';
    }
}

function getErrorInfo(errorResponse: AxiosResponse<any>) {
    const { data } = errorResponse || {};
    const { url, method } = errorResponse?.config || {};
    const { code, message, status } = data?.error || {};
    return { url, method, code, message, status };
}

function generateErrorMessage(errorResponse: AxiosResponse<any>) {
    const { url, method, code, message } = getErrorInfo(errorResponse);
    const errorMessage = message || getCustomErrorMessage(code);
    error(`----------------------------------------`);
    error(`[Vite-I18n-Checker][Request Error] ${method?.toUpperCase()} ${url}`);
    error(`Status : ${code} (HTTP ${status})`);
    error(`Message: ${errorMessage}`);
    error(`----------------------------------------`);
}

export { generateErrorMessage, getErrorInfo, STATUS_CODE };

