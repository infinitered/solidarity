const { head, tail, pipe, flatten, map } = require('ramda')
const checkCLI = require('./checkCLI')

module.exports = async (requirement, context) => {
  const { print, system } = context
  const { colors } = print
  const requirementName = head(requirement)
  const rules = pipe(tail, flatten)(requirement)

  let failures = []
  let ruleString = ''
  const spinner = print.spin(`Verifying ${requirementName}`)

  const addFailure = (commonMessage, customMessage, ruleString) => {
    if (customMessage) failures.push(customMessage)
    failures.push(commonMessage)
    spinner.fail(ruleString)
  }

  // check each rule for requirement
  map(async (rule) => {
    switch(rule.rule) {
      // Handle CLI rule check
      case 'cli':
        const cliResult = await checkCLI(rule, context)
        ruleString = `${requirementName} - ${rule.binary} binary`
        if (cliResult) {
          addFailure(cliResult, rule.error, ruleString)
        } else {
          spinner.succeed(ruleString)
        }
        break
      // Handle ENV rule check
      case 'env':
        ruleString = `${requirementName} - ${rule.variable} env`
        if (process.env[rule.variable]) {
          spinner.succeed(ruleString)
        } else {
          addFailure(`'$${rule.variable}' environment variable not found`, rule.error, ruleString)
        }
        break
      default:
        addFailure(`Encountered unknown rule '${rule.rule}'`, rule.error, `${requirementName} - ${rule.rule}`)
    }
  }, rules)

  spinner.stop()
  return failures
}
