const fs = require('fs');
const execSync = require('child_process').execSync;
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const workingDir = path.resolve(`${__dirname}/../`);


let currentVersion = process.env.CI_BUILD_REF;
console.info('-- CI_BUILD_REF', currentVersion);
if (!currentVersion) {
  currentVersion = execSync('git log -1 --pretty=format:"%h"').toString().trim();
}
fs.writeFileSync(`${workingDir}/.version`, currentVersion);
console.info('-- current build version saved in .version file');

if (env === 'staging' || env === 'production' || env === 'test') {
  console.info('-- building client files, this may take a while...');
  try {
    const out = execSync(
      `webpack -p --config webpack.${env}.config.js`,
      {
        cwd: workingDir,
        env: { NODE_ENV: 'production', PATH: process.env.PATH },
        uid: process.env.UID
      }
    );
    const parsedOut = out.toString().split('ERROR');
    if (parsedOut.length > 1) {
      parsedOut.shift();
      console.error(`ERROR ${parsedOut.join('ERROR')}`);
      process.exit(1);
    } else {
      console.info('-- finished building client files');
    }
    console.info('-- building server files, this may take a while...');
  } catch (err) {
    console.error(err);
  }
  try {
    const outBabel = execSync(
      'babel src --out-dir src-compiled --copy-files',
      {
        cwd: workingDir,
        env: { NODE_ENV: 'production', PATH: process.env.PATH },
        uid: process.env.UID
      }
    );
    const parsedOutBabel = outBabel.toString().split('ERROR');
    if (parsedOutBabel.length > 1) {
      parsedOutBabel.shift();
      console.error(`ERROR ${parsedOutBabel.join('ERROR')}`);
      process.exit(1);
    } else {
      console.info('-- finished building server files');
    }
  } catch (err) {
    console.error(err);
  }
}
