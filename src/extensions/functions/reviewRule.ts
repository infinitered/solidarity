
import { SolidarityRequirementChunk, SolidarityRequirement, SolidarityRunContext, SolidarityOutputMode, SolidarityRule, SolidarityReportResults } from '../../types'
import { head, tail, pipe, flatten, map } from 'ramda'
const skipRule = require('./skipRule')
const checkDir = require('./checkDir')
const checkFile = require('./checkFile')

module.exports = async (requirement: SolidarityRequirementChunk, report: SolidarityReportResults, context: SolidarityRunContext) => {
  const { print, system, solidarity } = context
  const { color } = print
  const prettyBool = (bl: boolean) => bl ? color.green('TRUE') : color.red('FALSE')
  const requirementName: string = head(requirement)
  const rules: SolidarityRequirement = pipe(tail, flatten)(requirement)
  // check each rule for report
  const ruleChecks = await map(async (rule: SolidarityRule) => {
    // Make sure this rule is active
    if (skipRule(rule.platform)) return false

    switch (rule.rule) {
      // Handle CLI rule report
      case 'cli':
        const desired = rule.semver ? rule.semver : color.green('ANY')
        let location
        try {
          location = system.which(rule.binary)
        } catch (_e) {
          location = color.red('MISSING')
        }

        let binaryVersion
        try {
          binaryVersion = await solidarity.getVersion(rule, context)
        } catch (_e) {
          binaryVersion = color.red('UNKNOWN')
        }
        report.cliRules.push([rule.binary, location, binaryVersion, desired])
        break
      // Handle ENV rule report
      case 'env':
        const envValue = process.env[rule.variable] || color.red('UNDEFINED')
        report.envRules.push([rule.variable, envValue])
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
