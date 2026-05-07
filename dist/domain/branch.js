"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBranchRules = validateBranchRules;
const similarity_1 = require("../utils/similarity");
const validation_1 = require("./validation");
const VALID_BRANCH_NAME_PATTERN = /^[\p{L}0-9._-]+$/u;
const INVALID_BRANCH_NAME_CHARS_PATTERN = /[^\p{L}0-9._-]/gu;
function validateBranchRules(branch, config) {
    const normalizedBranch = branch.trim();
    const prefixes = config.branchPrefixes;
    if (!normalizedBranch) {
        return (0, validation_1.invalid)('Branch name cannot be empty.', `${prefixes[0]}/my-feature`);
    }
    const [prefix, ...rest] = normalizedBranch.split('/');
    const branchName = rest.join('/');
    if (!normalizedBranch.includes('/')) {
        return (0, validation_1.invalid)(`Branch must start with one of: ${prefixes.join(', ')}`, `${prefixes[0]}/${normalizedBranch}`);
    }
    if (!prefixes.includes(prefix)) {
        const closest = (0, similarity_1.findClosest)(prefix, prefixes);
        return (0, validation_1.invalid)(`Prefix "${prefix}" is not valid.\n   → Allowed prefixes: ${prefixes.join(', ')}`, `${closest}/${branchName || 'my-branch'}`);
    }
    if (!branchName) {
        return (0, validation_1.invalid)('Branch name cannot be empty.', `${prefix}/my-feature`);
    }
    if (!VALID_BRANCH_NAME_PATTERN.test(branchName)) {
        const suggestion = branchName.replace(INVALID_BRANCH_NAME_CHARS_PATTERN, '-');
        return (0, validation_1.invalid)('Branch name contains invalid characters.', `${prefix}/${suggestion}`);
    }
    return (0, validation_1.valid)();
}
