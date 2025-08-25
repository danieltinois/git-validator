"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
const fs_1 = require("fs");
const path_1 = require("path");
const defaultConfig = {
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
};
function loadConfig() {
    const configPath = (0, path_1.join)(process.cwd(), '.gitvalidatorrc.json');
    if ((0, fs_1.existsSync)(configPath)) {
        try {
            const raw = (0, fs_1.readFileSync)(configPath, 'utf-8');
            const parsed = JSON.parse(raw);
            return { ...defaultConfig, ...parsed };
        }
        catch (error) {
            console.error('Error reading .gitvalidatorrc.json:', error);
        }
    }
    return defaultConfig;
}
