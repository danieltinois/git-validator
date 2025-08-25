"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommitMessage = validateCommitMessage;
/**
 * Validates commit messages following the Conventional Commits pattern
 * Valid example: "feat: add login"
 */
const config_1 = require("../config");
const similarity_1 = require("../utils/similarity");
function validateCommitMessage(message) {
    const config = (0, config_1.loadConfig)();
    const lines = message.split('\n');
    const header = lines[0];
    const body = lines.slice(1).join('\n');
    if (/^(WIP|fixup!|squash!)/i.test(header)) {
        const suggestion = header.replace(/^(WIP|fixup!|squash!):?\s*/i, 'feat: ');
        return `❌ Invalid commit: "${header}"
   → Temporary commits (WIP, fixup!, squash!) are not allowed.
   💡 Example: "${suggestion}"`;
    }
    const types = config.commitTypes;
    const headerParts = header.split(':');
    const typePart = headerParts[0].split('(')[0].trim();
    if (!header.includes(':')) {
        return `❌ Invalid commit: "${header}"
   → Missing type (e.g., feat, fix, chore, etc.)
   💡 Example: "feat: ${header}"`;
    }
    if (!types.includes(typePart)) {
        const closest = (0, similarity_1.findClosest)(typePart, types);
        const rest = headerParts.slice(1).join(':').trim();
        const suggestion = `${closest}: ${rest || 'describe your change'}`;
        return `❌ Invalid commit: "${header}"
   → Type "${typePart}" is not valid.
   → Allowed types: ${types.join(', ')}
   💡 Example: "${suggestion}"`;
    }
    const msg = header.split(': ')[1] || '';
    if (msg.length > config.maxCommitLength) {
        const suggestion = `${typePart}: ${msg.slice(0, config.maxCommitLength)}...`;
        return `❌ Invalid commit: "${header}"
   → Message too long (${msg.length} chars). Max allowed: ${config.maxCommitLength}
   💡 Example: "${suggestion}"`;
    }
    if (/BREAKING CHANGE:/i.test(body)) {
        return null;
    }
    return null;
}
