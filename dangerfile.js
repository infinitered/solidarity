import { message, danger, warn } from 'danger'
message(":tada:, this worked @" + danger.github.pr.user.login)
// import spellcheck from 'danger-plugin-spellcheck'

// let's spellcheck
// schedule(spellcheck())
// spellcheck()

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
