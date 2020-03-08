module.exports = function(config) {
    config.set({
        mutator: "typescript",
        packageManager: "yarn",
        reporters: ["html", "clear-text", "progress"],
        testRunner: "command",
        commandRunner: { command: "yarn run test-fast" },
        transpilers: ["typescript"],
        coverageAnalysis: "off",
        tsconfigFile: "tests/tsconfig.json",
        mutate: ["src/**/*.ts", "!src/index.ts", "!src/alsatian-*.ts", "!src/**/_*.ts", "!src/**/*.d.ts"],
    });
};
