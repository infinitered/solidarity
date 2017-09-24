const { head, tail, pipe, flatten, map, isEmpty } = require('ramda')
const checkCLI = require('./checkCLI')
const checkENV = require('./checkENV')
const skipRule = require('./skipRule')

module.exports = async (requirement, context) => {
  const { print, system } = context
  const { colors } = print
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

    switch(rule.rule) {
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
        break
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
        break
      default:
        return addFailure(`Encountered unknown rule '${rule.rule}'`, rule.error, `${requirementName} - ${rule.rule}`)
    }
  }, rules)

  // Run all the rule checks for a requirement
  return await Promise.all(ruleChecks)
    .then(results => {
      spinner.stop()
      return results
    })
    .catch(err => console.log(err))
}
