import { message, danger, warn, includes } from "danger"
message(":tada:, this worked @" + danger.github.pr.user.login)
// import { warn } from 'danger'
// import spellcheck from 'danger-plugin-spellcheck'
// warn('hellow world')

// let's spellcheck
// schedule(spellcheck())
// spellcheck()

// Enforce yarn.lock updates
const packageChanged = includes(danger.git.modified_files, 'package.json')
const yarnLockfileChanged = includes(danger.git.modified_files, 'yarn.lock')
const npmLockfileChanged = includes(danger.git.modified_files, 'package-lock.json')
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
