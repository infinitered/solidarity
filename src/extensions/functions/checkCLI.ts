import { SolidarityToolbox, CLIRule } from '../../types'
module.exports = async (rule: CLIRule, context: SolidarityToolbox): Promise<void> => {
  const { semver, solidarity } = context
  const binaryExists = require('./binaryExists')

  // First check for binary
  if (!binaryExists(rule.binary, context)) {
    throw new Error(`Binary '${rule.binary}' not found`)
  }

  // Is there a semver rule?
  if (rule.semver) {
    // ensure we have valid rule input
    if (!semver.validRange(rule.semver)) throw new Error(`Invalid semver rule ${rule.semver}`)

    let binaryVersion
    binaryVersion = await solidarity.getVersion(rule, context)

    // pad zeros for any non-semver version systems (rules still work)
    let binarySemantic = binaryVersion
    while (binarySemantic.split('.').length < 3) {
      binarySemantic += '.0'
    }

    const customMessage = (rule.error || '')
      .replace(/{{wantedVersion}}/gi, /\^|\~/.test(rule.semver) ? rule.semver.substr(1) : rule.semver)
      .replace(/{{installedVersion}}/gi, binaryVersion)
    const standardMessage = `${rule.binary}: you have '${binaryVersion}', but the project requires '${rule.semver}'`
    const message = customMessage || standardMessage

    // I can't get no satisfaction
    if (!semver.satisfies(binarySemantic, rule.semver)) {
      throw new Error(message)
    }
  }
}
