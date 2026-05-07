"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.CONFIG_FILE_NAME = void 0;
exports.mergeConfig = mergeConfig;
exports.loadConfig = loadConfig;
const fs_1 = require("fs");
const path_1 = require("path");
exports.CONFIG_FILE_NAME = '.gitvalidatorrc.json';
exports.defaultConfig = {
    commitTypes: [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
    ],
    branchPrefixes: ['feature', 'hotfix', 'release', 'bugfix', 'support'],
    maxCommitLength: 100,
    allowedEnvFiles: ['.env.example', '.env.sample', '.env.template'],
};
function normalizeStringList(value, fallback) {
    if (!Array.isArray(value)) {
        return [...fallback];
    }
    const values = value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean);
    return values.length > 0 ? values : [...fallback];
}
function normalizeMaxCommitLength(value) {
    if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
        return exports.defaultConfig.maxCommitLength;
    }
    return value;
}
function mergeConfig(value) {
    const input = value && typeof value === 'object'
        ? value
        : {};
    return {
        commitTypes: normalizeStringList(input.commitTypes, exports.defaultConfig.commitTypes),
        branchPrefixes: normalizeStringList(input.branchPrefixes, exports.defaultConfig.branchPrefixes),
        maxCommitLength: normalizeMaxCommitLength(input.maxCommitLength),
        allowedEnvFiles: normalizeStringList(input.allowedEnvFiles, exports.defaultConfig.allowedEnvFiles),
    };
}
function loadConfig(options = {}) {
    const cwd = options.cwd ?? process.cwd();
    const logger = options.logger ?? console;
    const configPath = (0, path_1.join)(cwd, exports.CONFIG_FILE_NAME);
    if ((0, fs_1.existsSync)(configPath)) {
        try {
            const raw = (0, fs_1.readFileSync)(configPath, 'utf-8');
            const parsed = JSON.parse(raw);
            return mergeConfig(parsed);
        }
        catch (error) {
            logger.warn(`Could not read ${exports.CONFIG_FILE_NAME}. Using defaults.`, error);
        }
    }
    return mergeConfig({});
}
