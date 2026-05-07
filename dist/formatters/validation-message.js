"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValidationResult = formatValidationResult;
function getInvalidLabel(kind) {
    if (kind === 'commit') {
        return 'Invalid commit';
    }
    if (kind === 'branch') {
        return 'Invalid branch';
    }
    return 'Invalid files';
}
function formatValidationResult(kind, value, result) {
    if (result.valid) {
        return null;
    }
    const lines = [
        `❌ ${getInvalidLabel(kind)}: "${value}"`,
        `   → ${result.failure.detail}`,
    ];
    if (result.failure.suggestion) {
        lines.push(`   💡 Example: "${result.failure.suggestion}"`);
    }
    return lines.join('\n');
}
