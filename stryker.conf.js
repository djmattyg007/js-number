module.exports = function(config) {
    config.set({
        mutator: "typescript",
        packageManager: "yarn",
        reporters: ["html", "clear-text", "progress"],
        testRunner: "command",
        transpilers: ["typescript"],
        coverageAnalysis: "off",
        tsconfigFile: "tests/tsconfig.json",
        mutate: ["src/**/*.ts", "!src/index.ts", "!src/**/_*.ts", "!src/**/*.d.ts"],
    });
};
