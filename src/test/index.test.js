'use strict';

const tmp = require('tmp');
const fs = require('fs-extra');
const path = require('path');

const flowConfigGenerate = require('..');

let _tmpDirCleanupFns = [];

async function createTmpDir() {
  return new Promise((resolve, reject) => {
    tmp.dir({keep: false, unsafeCleanup: true}, (err, path, cleanupCallback) => {
      if (err) return reject(err);
      _tmpDirCleanupFns.push(cleanupCallback);
      resolve(path);
    });
  });
}

afterEach(() => {
  _tmpDirCleanupFns.forEach(fn => fn());
  _tmpDirCleanupFns.length = 0;
});

it('should generate flowconfig file with folder in exclusion list excluded', async (done) => {
  const dir = await createTmpDir();
  path.join(dir, 'test1');
  path.join(dir, 'test2');
  path.join(dir, 'test3');

  await fs.mkdir(path.join(dir, 'test1'));
  await fs.mkdir(path.join(dir, 'test2'));
  await fs.mkdir(path.join(dir, 'test3'));
  await fs.copy('./src/test/.flowconfig.template', path.join(dir,'.flowconfig.template'));

  const templatePath = path.join(dir,'/.flowconfig.template');
  const folderPath = dir;
  const outputPath = dir;

  await flowConfigGenerate({templatePath,folderPath, outputPath});

  const dirContent = new Set(await fs.readdir(dir));
  // generated file
  const fileContent = await fs.readFile(path.join(dir,'/.flowconfig'));

  expect(dirContent)
    .toEqual(new Set(['.flowconfig.template','.flowconfig','test1','test2','test3']));

  expect(/test1/.test(fileContent)).toBeFalsy(); // gnerated file should contain test 1 folder name
  expect(/test2/.test(fileContent)).toBeTruthy(); // generated file should exclude the name of folder present in exclusion list
  done();
});
