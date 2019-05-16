#!/usr/bin/env node
'use strict';

const flowConfig = require('../src');

const argv = require('yargs')
  .usage('Usage: $0 [-t|--template] [-p|--folderPath] [-o|--outputPath]')
  .string('template')
  .alias('t', 'template')
  .describe('t', 'path of template file')
  .string('folder-path')
  .alias('p', 'folderPath')
  .describe('p', 'path of folder')
  .string('output-path')
  .alias('o', 'outputPath')
  .describe('o', 'path of geneeatred flowconfig folder')
  .strict()
  .argv;

  flowConfig({templatePath:argv.template, folderPath: argv.folderPath, outputPath: argv.outputPath})
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
