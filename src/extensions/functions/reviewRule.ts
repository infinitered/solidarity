import {
  SolidarityRequirementChunk,
  SolidarityRequirement,
  SolidarityRunContext,
  SolidarityRule,
  SolidarityReportResults,
} from '../../types'
import { tail, pipe, flatten, map } from 'ramda'
const skipRule = require('./skipRule')
const checkDir = require('./checkDir')
const checkFile = require('./checkFile')
const checkShell = require('./checkShell')

module.exports = async (
  requirement: SolidarityRequirementChunk,
  report: SolidarityReportResults,
  context: SolidarityRunContext
) => {
  const { print, system, solidarity } = context
  const { colors, checkmark, xmark } = print
  const prettyBool = (bl: boolean) => (bl ? checkmark + colors.green(' YES') : xmark + colors.red(' NO'))
  // @ts-ignore - flatten will never get a string bc tail is called first
  const rules: SolidarityRequirement = pipe(tail, flatten)(requirement)
  // check each rule for report
  const ruleChecks = map(async (rule: SolidarityRule) => {
    // Make sure this rule is active
    if (skipRule(rule.platform)) return false

    switch (rule.rule) {
      // Handle CLI rule report
      case 'cli':
        const desired = rule.semver ? rule.semver : colors.green('*ANY*')
        let location
        try {
          location = system.which(rule.binary)
        } catch (_e) {
          location = colors.red('*MISSING*')
        }

        let binaryVersion
        try {
          binaryVersion = await solidarity.getVersion(rule, context)
        } catch (_e) {
          binaryVersion = colors.red('*UNKNOWN*')
        }
        report.cliRules.push([rule.binary, location, binaryVersion, desired])
        break
      // Handle ENV rule report
      case 'env':
        const envValue = process.env[rule.variable] || colors.red('*UNDEFINED*')
        report.envRules.push([`$${rule.variable}`, envValue])
        break
      // Handle dir rule report
      case 'directory':
      case 'dir':
        const dirExists = prettyBool(checkDir(rule, context))
        report.filesystemRules.push([rule.location, 'Dir', dirExists])
        break
      // Handle file rule report
      case 'file':
        const fileExists = prettyBool(checkFile(rule, context))
        report.filesystemRules.push([rule.location, 'File', fileExists])
        break
      case 'shell':
        const shellCheckPass = prettyBool(await checkShell(rule, context))
        report.shellRules.push([rule.command, rule.match, shellCheckPass])
        break
      default:
        throw 'Encountered unknown rule'
    }
  }, rules)

  // Run all the rule checks for a requirement
  return Promise.all(ruleChecks)
    .then(results => {
      return results
    })
    .catch(err => print.error(err))
}
