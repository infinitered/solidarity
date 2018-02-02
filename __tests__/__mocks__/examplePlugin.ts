module.exports = context => {
  // Register this plugin
  context.addPlugin({
    name: 'Example Plugin',
    description: 'I help test plugins',
    snapshot: async context => {
      context.addedSnapshot = true
    },
    rules: {
      checkThing: {
        check: async (rule, context) => {
          return {
            pass: true,
            message: 'Yeah good check!',
          }
        },
        snapshot: async (rule, context) => [
          {
            prop: 'semver',
            value: '12.0.0',
          },
        ],
        report: async (rule, context, report) => {
          // report.cliRules.push(['android', location, binaryVersion, desired])
          report.addCLI({
            binary: 'Android SDK',
            version: 10,
            desired: 12,
          })
        },
      },
      checkSecondThing: {
        check: async (rule, context) => {
          return {
            pass: false,
            message: 'Boooo failed check',
          }
        },
      },
    },
  })

  return context
}
