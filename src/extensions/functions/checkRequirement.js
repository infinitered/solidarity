const { head, tail, pipe, flatten, map } = require('ramda')
const checkCLI = require('./checkCLI')
const checkENV = require('./checkENV')
const checkDir = require('./checkDir')
const checkFile = require('./checkFile')
const skipRule = require('./skipRule')

module.exports = async (requirement, context) => {
  const { print } = context
  const requirementName = head(requirement)
  const rules = pipe(tail, flatten)(requirement)

  let ruleString = ''
  const spinner = print.spin(`Verifying ${requirementName}`)

  const addFailure = (commonMessage, customMessage, ruleString) => {
    spinner.fail(ruleString)
    return customMessage || commonMessage
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
          return addFailure(cliResult, rule.error, ruleString)
        } else {
          spinner.succeed(ruleString)
          return []
        }
      // Handle ENV rule check
      case 'env':
        const envResult = await checkENV(rule, context)
        ruleString = `${requirementName} - ${rule.variable} env`
        if (envResult) {
          spinner.succeed(ruleString)
          return []
        } else {
          return addFailure(`'$${rule.variable}' environment variable not found`, rule.error, ruleString)
        }
      // Handle dir rule check
      case 'dir':
        const dirResult = checkDir(rule, context)
        ruleString = `${requirementName} - ${rule.location} directory`
        if (dirResult) {
          spinner.succeed(ruleString)
          return []
        } else {
          return addFailure(`'$${rule.location}' directory not found`, rule.error, ruleString)
        }
      // Handle dir rule check
      case 'file':
        const fileResult = checkFile(rule, context)
        ruleString = `${requirementName} - ${rule.location} file`
        if (fileResult) {
          spinner.succeed(ruleString)
          return []
        } else {
          return addFailure(`'$${rule.location}' file not found`, rule.error, ruleString)
        }
      default:
        return addFailure(`Encountered unknown rule '${rule.rule}'`, rule.error, `${requirementName} - ${rule.rule}`)
    }
  }, rules)

  // Run all the rule checks for a requirement
  return Promise.all(ruleChecks)
    .then(results => {
      spinner.stop()
      return results
    })
    .catch(err => print.error(err))
}
