import chalk from "chalk"

export function messageManager() {
    const success = (message: string) => {
        console.log(chalk.green(message))
    }

    const warning = (message: string) => {
        console.log(chalk.yellow(message))
    }

    const error = (message: string) => {
        console.log(chalk.red(message))
        process.exit(1);
    }

    return {
        success,
        error,
        warning
    }
}