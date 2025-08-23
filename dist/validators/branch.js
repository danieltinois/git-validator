"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBranchName = validateBranchName;
/**
 * Validates branch names following the Git Flow pattern
 * Valid example: "feature/new-feature"
 */
function validateBranchName(branch) {
    const regex = /^(feature|hotfix|release|bugfix|support)\/[a-z0-9._-]+$/;
    if (!regex.test(branch)) {
        return '❌ Invalid branch name. Use the Git Flow pattern (e.g., feature/new-feature).';
    }
    return null;
}
