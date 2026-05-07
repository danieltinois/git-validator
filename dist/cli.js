#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("./cli/runner");
const [command, value] = process.argv.slice(2);
(0, runner_1.run)(command, value);
