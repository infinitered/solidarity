// Get the version of a specific CLI
module.exports = async (rule, context) => {
  const { system, solidarity } = context


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
  const correctLine = solidarity.getLineWithVersion(rule, versionOutput)
  const version = solidarity.removeNonVersionCharacters(rule, correctLine)
  return version
}
