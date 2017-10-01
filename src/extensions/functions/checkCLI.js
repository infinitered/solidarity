// Get the version of a specific CLI
const getVersion = async (rule, context) => {
  const { system } = context

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
  const correctLine = getLineWithVersion(rule, versionOutput)
  const version = removeNonVersionCharacters(rule, correctLine)
  return version
}

const getLineWithVersion = (rule, versionOutput) => {
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
    //pass it through if rules don't provide a line
    result = versionOutput
  }
  return result
}

const removeNonVersionCharacters = (rule, line) => {
  const foundVersions = line.match(/(\d+\.)?(\d+\.)?(\d+)([^\sa-zA-Z0-9]+\w+)?/g)
  // Return longest match, because it is most likely to be correct
  try {
    var result = foundVersions[0]
    for (let i = 1; i < foundVersions.length; i++) {
      if (foundVersions[i].length >= result.length) {
        result = foundVersions[i]
      }
    }
  } catch (_e) {
    throw `No version was detected from the output of the binary '${rule.binary}'`
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
    // pad zeros for any non-semver version systems (rules still work)
    let binarySemantic = binaryVersion
    while (binarySemantic.split('.').length < 3) { binarySemantic += '.0' }

    // I can't get no satisfaction
    if (!semver.satisfies(binarySemantic, rule.semver)) {
      return `This system has an improper version for ${rule.binary}:
        Rule='${rule.semver}'
        Actual='${binaryVersion}'`
    }
  }
}
