import pc from 'picocolors';

const colorMap = {
    red: pc.red,
    green: pc.green,
    yellow: pc.yellow,
    cyan: pc.cyan,
} as const;

export type ColorName = keyof typeof colorMap;

export const getColor = (color: ColorName) => colorMap[color];

const success = (message: string) => {
    console.log(pc.green(message));
};

const warning = (message: string) => {
    console.log(pc.yellow(message));
};

const error = (message: string) => {
    console.log(pc.red(message));
};

export {
    success,
    error,
    warning,
};