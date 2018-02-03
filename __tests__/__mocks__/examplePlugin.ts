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
          report.addCLI({
            binary: 'node',
            version: '10',
            desired: '12',
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
        snapshot: async (rule, context) => [
          {
            prop: 'semver',
            value: '12.0.0',
          },
          {
            prop: 'nachos',
            value: true,
          },
        ],
      },
      checkThirdThing: {
        check: async (rule, context) => {
          return {
            pass: true,
            message: 'PAZZZZZ',
          }
        },
        snapshot: async (rule, context) => [],
      },
    },
  })

  return context
}
