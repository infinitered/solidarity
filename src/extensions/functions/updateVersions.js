const { map, toPairs, isEmpty, flatten } = require('ramda')

module.exports = async (context) => {
  const { solidarity, print } = context
  const { getSolidaritySettings, updateRequirement } = solidarity

  // load current solidarity file
  const solidaritySettings = getSolidaritySettings(context)

  // Map over requirements
  const checks = await map(
    async requirement => updateRequirement(requirement, solidaritySettings, context),
    toPairs(solidaritySettings)
  )

  // run the array of promises you just created
  await Promise.all(checks)
    .then(results => {
      const errors = flatten(results)
      if (isEmpty(errors)) {
        print.success('DONE')
      } else {
        print.error('Solidarity Update Failed:')
        print.error(errors)
        process.exit(1)
      }
    })
    .catch(err => {
      print.error(err)
      process.exit(2)
    })

}
