const { map, toPairs, isEmpty, flatten } = require('ramda')

const checkForEscapeHatchFlags = async(context) => {
  const { print, parameters } = context
  const { options } = parameters
  if (options.help || options.h) {
    // Just looking for help
    print.printCommands(context)
    process.exit(0)
  } else if (options.version || options.v) {
    // Just looking for version
    print.info(require('../../package.json').version)
    process.exit(0)
  }
}

const run = async (context) => {
  // drop out fast in these situations
  checkForEscapeHatchFlags(context)

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
        print.success('\n Environment Checks Valid')
      } else {
        print.error('\n Solidarity Check Failed:')
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
