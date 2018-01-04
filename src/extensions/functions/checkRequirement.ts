import {
  SolidarityRequirementChunk,
  SolidarityRequirement,
  SolidarityRunContext,
  SolidarityOutputMode,
  SolidarityRule,
} from '../../types'
const checkCLI = require('./checkCLI')
const checkENV = require('./checkENV')
const checkDir = require('./checkDir')
const checkFile = require('./checkFile')
const checkShell = require('./checkShell')
const skipRule = require('./skipRule')

module.exports = async (
  requirement: SolidarityRequirementChunk,
  context: SolidarityRunContext
): Promise<void | object[]> => {
  const { head, tail, pipe, flatten, map } = require('ramda')

  const { print } = context
  const requirementName: string = head(requirement)
  const rules: SolidarityRequirement = pipe(tail, flatten)(requirement)

  let ruleString = ''
  // Hide spinner if silent outputmode is set
  const spinner = context.outputMode !== SolidarityOutputMode.SILENT ? print.spin(`Verifying ${requirementName}`) : null
  const assertNever = (value: never): never => {
    throw Error(`Unexpected value '${value}'`)
  }

  const printResult = (checkSuccessful: boolean, resultMessage: string) => {
    switch (context.outputMode) {
      case SolidarityOutputMode.VERBOSE:
        // Print everything
        checkSuccessful ? spinner.succeed(resultMessage) : spinner.fail(resultMessage)
        break
      case SolidarityOutputMode.SILENT:
        // Print nothing
        break
      case SolidarityOutputMode.MODERATE:
      case undefined:
        // Print only errors
        if (!checkSuccessful) {
          spinner.fail(resultMessage)
        }
        break
      default:
        // enforce via typescript, no unhandled modes
        // will fail tsc if new enums added
        assertNever(context.outputMode)
        break
    }
  }

  const addFailure = (failureMessage: string) => {
    printResult(false, failureMessage)
    return failureMessage
  }

  // check each rule for requirement
  const ruleChecks = await map(async (rule: SolidarityRule) => {
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
      case 'directory':
      case 'dir':
        const dirResult = checkDir(rule, context)
        ruleString = `${requirementName} - ${rule.location} directory`
        if (dirResult) {
          printResult(true, ruleString)
          return []
        } else {
          return addFailure(rule.error || `'${rule.location}' directory not found`)
        }
      // Handle file rule check
      case 'file':
        const fileResult = checkFile(rule, context)
        ruleString = `${requirementName} - ${rule.location} file`
        if (fileResult) {
          printResult(true, ruleString)
          return []
        } else {
          return addFailure(rule.error || `'${rule.location}' file not found`)
        }
      // Handle the shell rule
      case 'shell':
        const shellResult = await checkShell(rule, context)
        if (shellResult) {
          ruleString = `${requirementName} - '${rule.command}' matches '${rule.match}'`
          printResult(true, ruleString)
          return []
        } else {
          return addFailure(rule.error || `'${rule.command}' output did not match '${rule.match}'`)
        }

      default:
        return addFailure(`Encountered unknown rule`)
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
