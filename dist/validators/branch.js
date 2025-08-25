"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBranchName = validateBranchName;
/**
 * Validates branch names following the Git Flow pattern
 * Valid example: "feature/new-feature"
 */
const config_1 = require("../config");
const similarity_1 = require("../utils/similarity");
function validateBranchName(branch) {
    const config = (0, config_1.loadConfig)();
    const prefixes = config.branchPrefixes;
    const [prefix, ...rest] = branch.split('/');
    const branchName = rest.join('/');
    if (!branch.includes('/')) {
        const suggestion = `${prefixes[0]}/${branch}`;
        return `❌ Invalid branch: "${branch}"
   → Branch must start with one of: ${prefixes.join(', ')}
   💡 Example: "${suggestion}"`;
    }
    if (!prefixes.includes(prefix)) {
        const closest = (0, similarity_1.findClosest)(prefix, prefixes);
        const suggestion = `${closest}/${branchName || 'my-branch'}`;
        return `❌ Invalid branch: "${branch}"
   → Prefix "${prefix}" is not valid.
   → Allowed prefixes: ${prefixes.join(', ')}
   💡 Example: "${suggestion}"`;
    }
    if (!branchName) {
        return `❌ Invalid branch: "${branch}"
   → Branch name cannot be empty.
   💡 Example: "${prefix}/my-feature"`;
    }
    const regex = /^[\p{L}0-9._-]+$/u;
    if (!regex.test(branchName)) {
        const suggestion = branchName.replace(/[^\p{L}0-9._-]/gu, '-');
        return `❌ Invalid branch: "${branch}"
   → Branch name contains invalid characters.
   💡 Example: "${prefix}/${suggestion}"`;
    }
    return null;
}
