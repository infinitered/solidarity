import { SolidarityRule } from '../../types'

// Return true if we should skip
module.exports = (rule: SolidarityRule): boolean => {
  let platform = rule.platform

  // check Skip CI shortcut first
  if (process.env.CI && rule.ci === false) {
    return true
  }

  if (typeof platform === 'string') {
    platform = platform.toLowerCase()
    platform = platform === 'windows' ? 'win32' : platform
    platform = platform === 'macos' ? 'darwin' : platform
    return platform !== process.platform
  } else if (Array.isArray(platform)) {
    platform.map(p => p.toLowerCase())
    const winIndex = platform.indexOf('windows')
    const macIndex = platform.indexOf('macos')
    if (winIndex >= 0) {
      platform[winIndex] = 'win32'
    }
    if (macIndex >= 0) {
      platform[macIndex] = 'darwin'
    }
    return !platform.includes(process.platform)
  } else {
    return false
  }
}
