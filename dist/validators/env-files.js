"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommittedFiles = validateCommittedFiles;
const config_1 = require("../config");
const env_files_1 = require("../domain/env-files");
const validation_message_1 = require("../formatters/validation-message");
function validateCommittedFiles(files, config = (0, config_1.loadConfig)()) {
    const result = (0, env_files_1.validateEnvFileRules)(files, config);
    return (0, validation_message_1.formatValidationResult)('files', 'commit file list', result);
}
