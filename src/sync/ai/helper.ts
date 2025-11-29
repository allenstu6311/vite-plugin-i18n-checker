function parseGoogleResponseError(error: any) {
    const res = error?.response;
    const { data } = res || {};
    const { url, method } = res?.config || {};
    const { code, message, status } = data?.error || {};

    return {
        type: "GOOGLE_API_ERROR",
        code,
        status,
        message: message,
        method,
        url
    };
}


function parseOpenAIResponseError(error: any) {
    const res = error?.response;
    const { data } = res || {};
    const { url, method } = res?.config || {};
    const { message, code } = data?.error || {};

    return {
        type: "OPENAI_API_ERROR",
        code: res.status,
        status: code,
        message: message,
        method,
        url
    };
}


export { parseGoogleResponseError, parseOpenAIResponseError };

