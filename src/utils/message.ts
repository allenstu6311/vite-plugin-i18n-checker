import chalk from "chalk"



const success = (message: string) => {
    console.log(chalk.green(message))
}

const warning = (message: string) => {
    console.log(chalk.yellow(message))
}

const error = (message: string) => {
    console.log(chalk.red(message))
}

export  {
    success,
    error,
    warning
}