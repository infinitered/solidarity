import {
  SolidarityRequirementChunk,
  SolidarityRequirement,
  SolidarityToolbox,
  SolidarityRule,
  SolidarityReportResults,
} from '../../types'

module.exports = async (
  requirement: SolidarityRequirementChunk,
  report: SolidarityReportResults,
  context: SolidarityToolbox
) => {
  const { tail, pipe, flatten, map } = require('ramda')
  const skipRule = require('./skipRule')
  const checkDir = require('./checkDir')
  const checkFile = require('./checkFile')
  const checkShell = require('./checkShell')
  const findPluginInfo = require('./findPluginInfo')

  const { print, solidarity } = context
  const { colors, checkmark, xmark } = print
  const prettyBool = async checkingFunction => {
    try {
      await checkingFunction()
      return checkmark + colors.green(' YES')
    } catch (e) {
      return xmark + colors.red(' NO')
    }
  }

  const rules: SolidarityRequirement = pipe(
    tail,
    // @ts-ignore - flatten will never get a string bc tail is called first
    flatten
  )(requirement)
  // check each rule for report
  const ruleChecks = map(async (rule: SolidarityRule) => {
    // Make sure this rule is active
    if (skipRule(rule)) return false

    switch (rule.rule) {
      // Handle CLI rule report
      case 'cli':
        let binaryVersion
        try {
          binaryVersion = await solidarity.getVersion(rule, context)
        } catch (_e) {
          binaryVersion = colors.red('*UNKNOWN*')
        }

        report.addCLI({
          binary: rule.binary,
          version: binaryVersion,
          desired: rule.semver,
        })
        break
      // Handle ENV rule report
      case 'env':
        const envValue = process.env[rule.variable] || colors.red('*UNDEFINED*')
        report.envRules.push([`$${rule.variable}`, envValue])
        break
      // Handle dir rule report
      case 'directory':
      case 'dir':
        const dirExists = await prettyBool(async () => checkDir(rule, context))
        report.filesystemRules.push([rule.location, 'Dir', dirExists])
        break
      // Handle file rule report
      case 'file':
        const fileExists = await prettyBool(async () => checkFile(rule, context))
        report.filesystemRules.push([rule.location, 'File', fileExists])
        break
      case 'shell':
        const shellCheckPass = await prettyBool(async () => checkShell(rule, context))
        report.shellRules.push([rule.command, rule.match, shellCheckPass])
        break
      case 'custom':
        const customPluginRule = findPluginInfo(rule, context)
        if (customPluginRule.success) {
          // let plugin update the report
          if (customPluginRule.plugin.report) await customPluginRule.plugin.report(rule, context, report)
        } else {
          throw new Error(customPluginRule.message)
        }
        break
      default:
        throw new Error('Encountered unknown rule')
    }
  }, rules)

  // Run all the rule checks for a requirement
  return Promise.all(ruleChecks).then(results => {
    return results
  })
}
