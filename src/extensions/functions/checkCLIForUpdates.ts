import { CLIRule, SolidarityRunContext } from '../../types'

module.exports = async (rule: CLIRule, context: SolidarityRunContext): Promise<string | undefined> => {
  const { system, semver, solidarity, print } = context

  // If binary is set but not found
  if (rule.binary) {
    try {
      system.which(rule.binary)
    } catch (_e) {
      return `Binary '${rule.binary}' not found`
    }
  }

  const binaryVersion = await solidarity.getVersion(rule, context)

  // pad zeros for any non-semver version systems (rules still work)
  let binarySemantic = binaryVersion
  while (binarySemantic.split('.').length < 3) {
    binarySemantic += '.0'
  }

  // if it doesn't satisfy, upgrade
  if (rule.semver && !semver.satisfies(binarySemantic, rule.semver)) {
    rule.semver = binaryVersion
    return print.color.green(`Setting ${rule.binary} to '${binaryVersion}'`)
  }
}
