"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommitRules = validateCommitRules;
const similarity_1 = require("../utils/similarity");
const validation_1 = require("./validation");
const TEMPORARY_COMMIT_PATTERN = /^(WIP|fixup!|squash!)/i;
const TEMPORARY_COMMIT_PREFIX_PATTERN = /^(WIP|fixup!|squash!):?\s*/i;
const BREAKING_CHANGE_PATTERN = /BREAKING CHANGE:/i;
function getCommitType(header) {
    return header.split(':')[0].split('(')[0].replace('!', '').trim();
}
function getCommitSubject(header) {
    return header.split(':').slice(1).join(':').trim();
}
function validateCommitRules(message, config) {
    const normalizedMessage = message.trim();
    const lines = normalizedMessage.split('\n');
    const header = lines[0];
    const body = lines.slice(1).join('\n');
    if (!header) {
        return (0, validation_1.invalid)('Commit message cannot be empty.', 'feat: describe your change');
    }
    if (TEMPORARY_COMMIT_PATTERN.test(header)) {
        const suggestion = header.replace(TEMPORARY_COMMIT_PREFIX_PATTERN, 'feat: ');
        return (0, validation_1.invalid)('Temporary commits (WIP, fixup!, squash!) are not allowed.', suggestion);
    }
    const type = getCommitType(header);
    if (!header.includes(':')) {
        return (0, validation_1.invalid)('Missing type (e.g., feat, fix, chore, etc.)', `feat: ${header}`);
    }
    if (!config.commitTypes.includes(type)) {
        const closest = (0, similarity_1.findClosest)(type, config.commitTypes);
        const subject = getCommitSubject(header);
        return (0, validation_1.invalid)(`Type "${type}" is not valid.\n   → Allowed types: ${config.commitTypes.join(', ')}`, `${closest}: ${subject || 'describe your change'}`);
    }
    const subject = getCommitSubject(header);
    if (!subject) {
        return (0, validation_1.invalid)('Commit description cannot be empty.', `${type}: describe your change`);
    }
    if (subject.length > config.maxCommitLength) {
        return (0, validation_1.invalid)(`Message too long (${subject.length} chars). Max allowed: ${config.maxCommitLength}`, `${type}: ${subject.slice(0, config.maxCommitLength)}...`);
    }
    if (BREAKING_CHANGE_PATTERN.test(body)) {
        return (0, validation_1.valid)();
    }
    return (0, validation_1.valid)();
}
