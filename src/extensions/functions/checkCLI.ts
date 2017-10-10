module.exports = async (rule, context) => {
  const { system, semver, solidarity } = context

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

    const binaryVersion = await solidarity.getVersion(rule, context)
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
