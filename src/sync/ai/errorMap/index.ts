import { AIProvider, ProviderErrorMap } from "../../types";
import { googleErrorMap } from "./google";

const errorMap: Record<AIProvider, ProviderErrorMap> = {
    'google': googleErrorMap,
    'openai': {},
};

export default errorMap;
