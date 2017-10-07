module.exports = async (rule, context) => {
  const { system, semver, solidarity, print } = context
  const { color } = print

  // First check for binary
  try {
    system.which(rule.binary)
  } catch (_e) {
    return `Binary '${rule.binary}' not found`
  }

  const binaryVersion = await solidarity.getVersion(rule, context)

  // pad zeros for any non-semver version systems (rules still work)
  let binarySemantic = binaryVersion
  while (binarySemantic.split('.').length < 3) { binarySemantic += '.0' }

  // If it doesn't satisfy, upgrade
  if (!semver.satisfies(binarySemantic, rule.semver)) {
    rule.semver = binaryVersion
    return color.green(`Setting ${rule.binary} to '${binaryVersion}'`)
  }
}
