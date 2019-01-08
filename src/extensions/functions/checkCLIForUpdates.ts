import { CLIRule, SolidarityRunContext } from '../../types'

module.exports = async (rule: CLIRule, context: SolidarityRunContext): Promise<string | undefined> => {
  const { system, semver, solidarity, print } = context

  // If binary is set but not found
  if (rule.binary) {
    if (Boolean(system.which(rule.binary)) === false) {
      return `Binary '${rule.binary}' not found`
    }
  }

  const binaryVersion = await solidarity.getVersion(rule, context)

  // pad zeros for any non-semver version systems (rules still work)
  let binarySemantic = binaryVersion
  while (binarySemantic.split('.').length < 3) {
    binarySemantic += '.0'
  }

  // if it doesn't satisfy, upgrade, and retain semver symbol
  if (rule.semver && !semver.satisfies(binarySemantic, rule.semver)) {
    rule.semver = `${/\^|\~/.test(rule.semver) ? rule.semver.charAt(0) : ''}${binaryVersion}`
    const lineMessage = rule.line ? ` line ${rule.line}` : ''
    return print.colors.green(`Setting ${rule.binary}${lineMessage} to '${rule.semver}'`)
  }
}
