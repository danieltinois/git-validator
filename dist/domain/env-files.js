"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvFileRules = validateEnvFileRules;
const path_1 = require("path");
const validation_1 = require("./validation");
function parseFileList(files) {
    const values = Array.isArray(files) ? files : files.split(/\r?\n/);
    return values.map((file) => file.trim()).filter(Boolean);
}
function isEnvFile(filePath, allowedEnvFiles) {
    const fileName = (0, path_1.basename)(filePath);
    if (allowedEnvFiles.includes(fileName)) {
        return false;
    }
    return fileName === '.env' || fileName.startsWith('.env.');
}
function validateEnvFileRules(files, config) {
    const blockedFiles = parseFileList(files).filter((file) => isEnvFile(file, config.allowedEnvFiles));
    if (blockedFiles.length === 0) {
        return (0, validation_1.valid)();
    }
    return (0, validation_1.invalid)(`Do not commit environment files:\n   → ${blockedFiles.join('\n   → ')}`, 'remove the .env file from the commit and keep only .env.example');
}
