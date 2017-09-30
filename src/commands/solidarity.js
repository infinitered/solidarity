const { map, toPairs, isEmpty, flatten } = require('ramda')

const run = async (context) => {
  const { print, solidarity } = context
  const { checkRequirement, getSolidaritySettings } = solidarity

  // get settings
  const solidaritySettings = getSolidaritySettings(context)

  // build map of checks to perform
  const checks = await map(
    async requirement => checkRequirement(requirement, context),
    toPairs(solidaritySettings)
  )

  // run the array of promises you just created
  await Promise.all(checks)
    .then(results => {
      const errors = flatten(results)
      if (isEmpty(errors)) {
        print.success('DONE')
      } else {
        print.error('Solidarity Check Failed:')
        print.error(errors)
        process.exit(1)
      }
    })
    .catch(err => {
      print.error(err)
      process.exit(2)
    })
}

// Export command
module.exports = {
  description: 'Check environment rules',
  run
}
