"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USAGE = void 0;
exports.run = run;
const branch_1 = require("../validators/branch");
const commit_1 = require("../validators/commit");
const env_files_1 = require("../validators/env-files");
const hook_1 = require("./hook");
exports.USAGE = `Usage:
  git-validator-cli init
  git-validator-cli commit "feat: add login"
  git-validator-cli branch "feature/new-feature"
  git-validator-cli files ".env.local"`;
function exitWithError(message) {
    console.error(message);
    process.exit(1);
}
function runValidation(value, validator, successMessage) {
    if (!value) {
        exitWithError(exports.USAGE);
    }
    const error = validator(value);
    if (error) {
        exitWithError(error);
    }
    console.log(successMessage);
}
function run(command, value) {
    switch (command) {
        case 'init':
            try {
                (0, hook_1.installPrePushHook)();
            }
            catch (error) {
                exitWithError(`❌ Error installing hook: ${error}`);
            }
            return;
        case 'commit':
            runValidation(value, commit_1.validateCommitMessage, '✅ Valid commit!');
            return;
        case 'branch':
            runValidation(value?.trim(), branch_1.validateBranchName, '✅ Valid branch!');
            return;
        case 'files':
            runValidation(value, env_files_1.validateCommittedFiles, '✅ Valid files!');
            return;
        default:
            exitWithError(exports.USAGE);
    }
}
