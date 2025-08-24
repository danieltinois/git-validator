"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommitMessage = validateCommitMessage;
/**
 * Validates commit messages following the Conventional Commits pattern
 * Valid example: "feat: add login"
 */
const config_1 = require("../config");
function validateCommitMessage(message) {
    const config = (0, config_1.loadConfig)();
    const types = config.commitTypes.join('|');
    const regex = new RegExp(`^(${types})(\\([\\w\\-]+\\))?: .{1,${config.maxCommitLength}}$`);
    if (!regex.test(message)) {
        return `❌ Invalid commit. Use the Conventional Commits pattern (e.g., feat: add login). Allowed types: ${config.commitTypes.join(', ')}. Max length: ${config.maxCommitLength}`;
    }
    return null;
}
