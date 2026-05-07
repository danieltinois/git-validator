"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommitMessage = validateCommitMessage;
/**
 * Validates commit messages following the Conventional Commits pattern
 * Valid example: "feat: add login"
 */
const config_1 = require("../config");
const commit_1 = require("../domain/commit");
const validation_message_1 = require("../formatters/validation-message");
function validateCommitMessage(message, config = (0, config_1.loadConfig)()) {
    const header = message.trim().split('\n')[0];
    const result = (0, commit_1.validateCommitRules)(message, config);
    return (0, validation_message_1.formatValidationResult)('commit', header, result);
}
