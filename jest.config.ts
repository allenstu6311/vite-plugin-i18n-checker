/** @type {import('ts-jest').JestConfigWithTsJest} */

/**
 * ts-jest 設定
 * https://dev.to/bregwin/testing-troubles-with-jest-and-esm-and-how-to-fix-it-pae
 */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1' // 對應 tsconfig.json 的 paths
    },
    testPathIgnorePatterns: ["/node_modules/", "/dist"],
}