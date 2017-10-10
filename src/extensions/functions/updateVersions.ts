
module.exports = async (context) => {
  const { map, toPairs, isEmpty, flatten } = require('ramda')  
  const { solidarity, print } = context
  const {
    getSolidaritySettings,
    setSolidaritySettings,
    updateRequirement
  } = solidarity

  // load current solidarity file
  const solidaritySettings = getSolidaritySettings(context)

  // Map over requirements with option to mutate settings
  const checks = await map(
    async requirement => updateRequirement(requirement, solidaritySettings, context),
    toPairs(solidaritySettings)
  )

  // run the array of promises you just created
  await Promise.all(checks)
    .then(results => {
      const updates = flatten(results)
      if (isEmpty(updates)) {
        print.success('\n No Changes')
      } else {
        setSolidaritySettings(solidaritySettings, context)
        print.success(`\n ${updates.length} Rule(s) updated`)
      }
    })
    .catch(err => {
      print.error(err)
      process.exit(2)
    })

}
