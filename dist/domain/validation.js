"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valid = valid;
exports.invalid = invalid;
function valid() {
    return { valid: true };
}
function invalid(detail, suggestion) {
    return {
        valid: false,
        failure: {
            detail,
            suggestion,
        },
    };
}
