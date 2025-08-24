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
    const lines = message.split('\n');
    const header = lines[0];
    const body = lines.slice(1).join('\n');
    if (/^(WIP|fixup!|squash!)/i.test(header)) {
        return '❌ Invalid commit. Temporary commits (WIP, fixup!, squash!) are not allowed.';
    }
    const types = config.commitTypes.join('|');
    const headerRegex = new RegExp(`^(${types})(\\([\\w\\-]+\\))?: .{1,${config.maxCommitLength}}$`);
    if (!headerRegex.test(message)) {
        return `❌ Invalid commit. Use the Conventional Commits pattern (e.g., feat: add login). Allowed types: ${config.commitTypes.join(', ')}. Max length: ${config.maxCommitLength}`;
    }
    if (/BREAKING CHANGE:/i.test(body)) {
        return null;
    }
    return null;
}
