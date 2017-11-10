// Return true if we should skip
module.exports = (platform: string | string[]): boolean => {
  if (typeof platform === 'string') {
    platform = platform.toLowerCase()
    platform = (platform === 'windows') ? 'win32' : platform
    platform = (platform === 'macos') ? 'darwin' : platform
    return platform !== process.platform
  } else if (Array.isArray(platform)) {
    platform.map((p) => p.toLowerCase())
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
