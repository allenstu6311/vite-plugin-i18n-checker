import chalk from "chalk"

export function messageManager() {
    const success = (message: string) => {
       console.log(chalk.green(message))
    }

    const error = (message: string) => {
        console.log(chalk.red(message))
    }

    return {
        success,
        error,
    }
}