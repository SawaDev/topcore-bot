module.exports = {
    clearMocks: true,
    setupFiles: ["dotenv/config"],
    moduleDirectories: ["node_modules", "src"],
    coverageDirectory: "<rootDir>/test/coverage",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    preset: "ts-jest"
}
