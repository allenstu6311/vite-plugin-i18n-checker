import { ProviderErrorMap } from "../../types";

const googleErrorMap: ProviderErrorMap = {
    INVALID_ARGUMENT: {
        code: 400,
        possibleCauses: [
            "The request format is invalid (malformed JSON).",
            "Input parameters do not meet model requirements, such as overly long or empty strings.",
            "The prompt contains unsupported characters or invalid formatting.",
            "The model endpoint does not support the provided parameter format.",
        ],
        suggestions: [
            "Verify that the request body is valid JSON.",
            "Ensure that the text to translate is a valid string (not empty or null).",
            "Check whether the model supports the parameter format (e.g., topK, topP).",
            "If using SSE or streaming, ensure that the endpoint is correct.",
        ],
    },

    FAILED_PRECONDITION: {
        code: 400,
        possibleCauses: [
            "Required services for Gemini API are not enabled.",
            "The model is not available in the current region.",
            "Google AI Studio or Cloud project has not enabled billing.",
            "The model version is restricted or unavailable (e.g., gemini-2.5 may require access).",
        ],
        suggestions: [
            "Enable 'Generative Language API' in Google Cloud Console.",
            "Verify that the model version is available (e.g., gemini-1.5 vs gemini-2.0).",
            "If using an AI Studio API key, ensure API access permissions are granted.",
            "Ensure billing is enabled, as some models require it.",
        ],
    },

    PERMISSION_DENIED: {
        code: 403,
        possibleCauses: [
            "The API key does not have permission to access Gemini API.",
            "The API key is restricted (e.g., HTTP referrer / IP restrictions).",
            "The requested model is access-restricted and requires special permissions.",
            "The user or service account lacks permission to access googleapis.com resources.",
        ],
        suggestions: [
            "Verify that the API key is valid and not expired.",
            "Confirm that API key restrictions allow CLI / localhost usage.",
            "Enable 'Generative Language API' in Google Cloud Console.",
            "Check whether the requested model requires additional access approval.",
        ],
    },

    NOT_FOUND: {
        code: 404,
        possibleCauses: [
            "The model name is incorrect (typo or wrong version).",
            "Requested resource does not exist, such as an invalid endpoint path.",
        ],
        suggestions: [
            "Verify that the model name is correct (e.g., gemini-2.0-flash).",
            "Ensure that the endpoint matches the expected pattern: models/{model}:generateContent.",
            "Check whether the model is available in the region you are calling from.",
        ],
    },

    RESOURCE_EXHAUSTED: {
        code: 403,
        possibleCauses: [
            "Quota limit has been reached.",
            "Too many requests in a short period (rate limiting).",
            "The free tier or account quota has been fully consumed.",
        ],
        suggestions: [
            "Check Google Cloud quota usage to confirm if limits have been reached.",
            "Reduce request frequency or implement retry/backoff logic.",
            "Enable billing or upgrade your quota plan.",
        ],
    },

    INTERNAL: {
        code: 500,
        possibleCauses: [
            "Internal server error within Google (not caused by the user).",
            "The model is temporarily unavailable or unstable.",
        ],
        suggestions: [
            "Retry the request after some time.",
            "If the issue persists, try switching to another model version.",
        ],
    },
    UNAVAILABLE: {
        code: 503,
        possibleCauses: [
            "The Google API service is temporarily unavailable.",
            "Model services are being redeployed or undergoing maintenance.",
            "Temporary high system load.",
        ],
        suggestions: [
            "Retry the request after a few seconds.",
            "If repeated failures occur, switch to a nearby model version (e.g., gemini-1.5 → gemini-2.0).",
        ],
    },

    DEADLINE_EXCEEDED: {
        code: 504,
        possibleCauses: [
            "The Google API did not respond within the timeout window.",
            "The request timeout was set too low.",
            "The model took too long to process the input.",
        ],
        suggestions: [
            "Increase the timeout duration for the request.",
            "Reduce the input size (large prompts may take longer to process).",
            "Retry the request later.",
        ],
    },
};

export { googleErrorMap };

