const { head, tail, pipe, flatten, map } = require('ramda')
const checkCLI = require('./checkCLI')
const skipRule = require('./skipRule')

module.exports = async (requirement, settings, context) => {
  const { print } = context
  const requirementName = head(requirement)
  const rules = pipe(tail, flatten)(requirement)

  let ruleString = ''
  const spinner = print.spin(`Updating ${requirementName}`)

  const addFailure = (commonMessage, customMessage, ruleString) => {
    spinner.fail(ruleString)
    return customMessage || commonMessage
  }

  // check each rule for requirement
  const ruleChecks = await map(async (rule) => {
    // skip if we can't update
    if (skipRule(rule.platform) || !rule.semver) return []

    switch (rule.rule) {
      // Handle CLI rule update
      case 'cli':
        const cliResult = await checkCLI(rule, context)
        ruleString = `${rule.binary} ${rule.semver}`
        if (cliResult) {
          return addFailure(cliResult, rule.error, ruleString)
        } else {
          spinner.succeed(ruleString)
          return []
        }
      default:
        return []
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
