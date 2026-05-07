#!/usr/bin/env node
import { run } from './cli/runner';

const [command, value] = process.argv.slice(2);

run(command, value);
