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
  }

  return semver.clean(versionOutput)
}

// find semver based on rule and output
const getVersionLine = (rule, versionOutput) => {
  // TODO:  for now first line every time
  return versionOutput.split('\n')[0]
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
      return `Improper version '${rule.semver}' for ${rule.binary}`
    }
  }
}
