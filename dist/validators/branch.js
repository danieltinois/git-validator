"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBranchName = validateBranchName;
/**
 * Validates branch names following the Git Flow pattern
 * Valid example: "feature/new-feature"
 */
const config_1 = require("../config");
const branch_1 = require("../domain/branch");
const validation_message_1 = require("../formatters/validation-message");
function validateBranchName(branch, config = (0, config_1.loadConfig)()) {
    const normalizedBranch = branch.trim();
    const result = (0, branch_1.validateBranchRules)(normalizedBranch, config);
    return (0, validation_message_1.formatValidationResult)('branch', normalizedBranch, result);
}
