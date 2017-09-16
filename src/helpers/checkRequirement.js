const { head, tail, pipe, flatten, map } = require('ramda')
const checkCLI = require('./checkCLI')
module.exports = async (requirement, context) => {
  const { print, system } = context
  const { colors } = print
  const requirementName = head(requirement)
  const rules = pipe(tail, flatten)(requirement)

  let failures = []
  const spinner = print.spin(`Verifying ${requirementName}`)
  // check each rule for requirement
  map(async (rule) => {
    switch(rule.rule) {
      case 'cli':
        const cliResult = await checkCLI(rule, context)
        if (cliResult) {
          failures.push(cliResult)
          spinner.fail(`${requirementName}`)
        } else {
          spinner.succeed(`${requirementName}`)
        }
        break
      case 'env':
        // check ENV rule
        break
      default:
        failures.push(`Encountered unknown rule '${rule.rule}'`)
    }
  }, rules)

  return failures
}
