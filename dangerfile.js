import { message, danger, warn, schedule } from 'danger'
// can't use import in JS
const spellcheck = require('danger-plugin-spellcheck').default

// warn('Big ol mean warning')
// let's spellcheck
schedule(spellcheck())

// Enforce yarn.lock updates
const packageChanged = danger.git.modified_files.includes('package.json')
const yarnLockfileChanged = danger.git.modified_files.includes('yarn.lock')
const npmLockfileChanged = danger.git.modified_files.includes('package-lock.json')
if (packageChanged && !yarnLockfileChanged) {
  const message = 'Changes were made to package.json, but not to yarn.lock'
  const idea = 'Perhaps you need to run `yarn install`?'
  warn(`${message} - <i>${idea}</i>`)
}
// Enforce package-lock.json
if (packageChanged && !npmLockfileChanged) {
  const message = 'Changes were made to package.json, but not to package-lock.json'
  const idea = 'Perhaps you need to run `npm install`?'
  warn(`${message} - <i>${idea}</i>`)
}
