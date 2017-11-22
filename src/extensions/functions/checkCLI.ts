import { SolidarityRunContext, CLIRule } from '../../types'
module.exports = async (rule: CLIRule, context: SolidarityRunContext): Promise<string | undefined> => {
  const { semver, solidarity } = context
  const binaryExists = require('./binaryExists')

  // First check for binary
  if (!binaryExists(rule.binary, context)) {
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
      return `${rule.binary}: you have '${binaryVersion}', but the project requires '${rule.semver}'`
    }
  }
}
