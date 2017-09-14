// @solidarityDescription Checks various programs.
const { map, toPairs, isEmpty, flatten } = require('ramda')
const { checkRequirement, getSolidaritySettings } = require('../helpers')

module.exports = async function(context) {
  const { print, filesystem, system } = context
  const { colors } = print

  if (filesystem.exists('.solidarity')) {
    const solidaritySettings = getSolidaritySettings(context)
    const checks = await map(
      async requirement => checkRequirement(requirement, context),
      toPairs(solidaritySettings)
    )
    // run the array of promises you created
    Promise.all(checks).then(results => {
      if (isEmpty(flatten(results))) {
        print.success('DONE')
      } else {
        print.error(results)
      }
    })
  } else {
    print.error('ERROR: No `.solidarity` file found')
    print.info(
      `Make sure you are in the correct folder or run ${colors.success(
        'solidarity snapshot'
      )} to take a snapshot of your environment and create a .solidarity file for this project.`
    )
    process.exit(1)
  }
}
