// Get the version of a specific CLI
const getVersion = async (rule, context) => {
  const { system, semver } = context

  let versionOutput
  // They specified how to check version
  if (rule.version) {
    versionOutput = await system.run(`${rule.binary} ${rule.version}`)
  } else {
    // We try the following in this order
    // -v, --version, -version
    try { versionOutput = await system.run(`${rule.binary} -v`) } catch(_e) {
      try { versionOutput = await system.run(`${rule.binary} --version`) } catch(_e) {
        try { versionOutput = await system.run(`${rule.binary} -version`) } catch(_e) {
          throw 'No version identifier flag for this binary was found'
        }
      }
    }

  }

  // Now parse
  const correctLine = getVersionLine(rule, versionOutput)
  // clean version to only consist of numbers (better than semver.clean)
  return correctLine.replace(/[^\d.]/g, '')
}

// find semver based on rule and output
const getVersionLine = (rule, versionOutput) => {
  let result
  if (typeof rule.line === 'number') {
    result = versionOutput.split('\n')[rule.line - 1]
  } else if (typeof rule.line === 'string') {
    const findString = `.*${rule.line}.*`
    const findRegex = RegExp(findString, 'g')
    const foundLines = versionOutput.match(findRegex)
    try {
      // Always first instance
      result = foundLines[0]
    } catch (_e) {
      throw `rule.line string '${rule.line}' was not found`
    }
  } else {
    // Parse output for something that looks like a version
    const foundVersions = versionOutput.match(/(\d+\.)?(\d+\.)?(\d+)/g)
    try {
      // Always first match (for now...)
      result = foundVersions[0]
    } catch (_e) {
      throw `No version was detected from the output of the binary '${rule.binary}'`
    }
  }

  return result
}

module.exports = async (rule, context) => {
  const { system, semver } = context

  // First check for binary
  try {
    system.which(rule.binary)
  } catch (_e) {
    return `Binary '${rule.binary}' not found`
  }

  // Is there a semver rule?
  if (rule.semver) {
    // ensure we have valid rule input
    if (!semver.validRange(rule.semver)) return `Invalid semver rule ${rule.semver}`

    const binaryVersion = await getVersion(rule, context)
    // I can't get no satisfaction
    if (!semver.satisfies(binaryVersion, rule.semver)) {
      return `This system has an improper version for ${rule.binary}:
        Rule='${rule.semver}'
        Actual='${binaryVersion}'`
    }
  }
}
