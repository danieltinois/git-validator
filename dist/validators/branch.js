"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBranchName = validateBranchName;
/**
 * Validates branch names following the Git Flow pattern
 * Valid example: "feature/new-feature"
 */
const config_1 = require("../config");
function validateBranchName(branch) {
    const config = (0, config_1.loadConfig)();
    const prefixes = config.branchPrefixes.join('|');
    const regex = new RegExp(`^(${prefixes})/[a-zA-Z0-9._-]+$`);
    if (!regex.test(branch)) {
        return `❌ Invalid branch name. Use one of: ${config.branchPrefixes.join(', ')}/<name>`;
    }
    return null;
}
