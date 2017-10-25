import { SolidarityRequirement, SolidarityRunContext, SolidarityOutputMode } from '../../types'
const checkCLI = require('./checkCLI')
const checkENV = require('./checkENV')
const checkDir = require('./checkDir')
const checkFile = require('./checkFile')
const skipRule = require('./skipRule')

module.exports = async (requirement: SolidarityRequirement, context: SolidarityRunContext): Promise<void | object[]> => {
  const { head, tail, pipe, flatten, map } = require('ramda')

  const { print } = context
  const requirementName = head(requirement)
  const rules = pipe(tail, flatten)(requirement)

  let ruleString = ''
  // Hide spinner if silent outputmode is set
  const spinner = context.outputMode !== SolidarityOutputMode.SILENT ? print.spin(`Verifying ${requirementName}`) : null

  const printResult = (checkSuccessful, resultMessage) => {
    switch (context.outputMode) {
      case SolidarityOutputMode.VERBOSE:
        // Print everything
        checkSuccessful ? spinner.succeed(resultMessage) : spinner.fail(resultMessage)
        break
      case SolidarityOutputMode.SILENT:
        // Print nothing
        break
      case SolidarityOutputMode.MODERATE:
      default:
        // Print only errors
        if (!checkSuccessful) {
          spinner.fail(resultMessage)
        }
        break
    }
  }

  const addFailure = (failureMessage) => {
    printResult(false, failureMessage)
    return failureMessage
  }

  // check each rule for requirement
  const ruleChecks = await map(async (rule) => {
    // Make sure this rule is active
    if (skipRule(rule.platform)) return []

    switch (rule.rule) {
      // Handle CLI rule check
      case 'cli':
        const cliResult = await checkCLI(rule, context)
        ruleString = `${requirementName} - ${rule.binary} binary`
        if (cliResult) {
          return addFailure(rule.error || cliResult)
        } else {
          printResult(true, ruleString)
          return []
        }
      // Handle ENV rule check
      case 'env':
        const envResult = await checkENV(rule, context)
        ruleString = `${requirementName} - ${rule.variable} env`
        if (envResult) {
          printResult(true, ruleString)
          return []
        } else {
          return addFailure(rule.error || `'$${rule.variable}' environment variable not found`)
        }
      // Handle dir rule check
      case 'dir':
        const dirResult = checkDir(rule, context)
        ruleString = `${requirementName} - ${rule.location} directory`
        if (dirResult) {
          printResult(true, ruleString)
          return []
        } else {
          return addFailure(rule.error || `'${rule.location}' directory not found`)
        }
      // Handle dir rule check
      case 'file':
        const fileResult = checkFile(rule, context)
        ruleString = `${requirementName} - ${rule.location} file`
        if (fileResult) {
          printResult(true, ruleString)
          return []
        } else {
          return addFailure(rule.error || `'${rule.location}' file not found`)
        }
      default:
        return addFailure(rule.error || `Encountered unknown rule '${rule.rule}'`)
    }
  }, rules)

  // Run all the rule checks for a requirement
  return Promise.all(ruleChecks)
    .then(results => {
      if (spinner !== null) {
        spinner.stop()
      }
      return results
    })
    .catch(err => print.error(err))
}
