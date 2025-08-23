"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommitMessage = validateCommitMessage;
/**
 * Validates commit messages following the Conventional Commits pattern
 * Valid example: "feat: add login"
 */
function validateCommitMessage(message) {
    const regex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([\w\-]+\))?: .{1,50}$/;
    if (!regex.test(message)) {
        return '❌ Invalid commit. Use the Conventional Commits pattern (e.g., feat: add login).';
    }
    return null;
}
