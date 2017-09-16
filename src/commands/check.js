// @solidarityDescription Checks various programs.
const { map, toPairs, isEmpty, flatten } = require('ramda')
const { checkRequirement, getSolidaritySettings } = require('../helpers')

module.exports = async function(context) {
  const { print, filesystem, system } = context
  const { colors } = print

  // get settings
  const solidaritySettings = getSolidaritySettings(context)

  // build map of checks to perform
  const checks = await map(
    async requirement => checkRequirement(requirement, context),
    toPairs(solidaritySettings)
  )

  // run the array of promises you just created
  Promise.all(checks).then(results => {
    const errors = flatten(results)
    if (isEmpty(errors)) {
      print.success('DONE')
    } else {
      print.error('Solidarity Check Failed:')
      print.error(errors)
      process.exit(1)
    }
  })
}
