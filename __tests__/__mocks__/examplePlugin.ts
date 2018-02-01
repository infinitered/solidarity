module.exports = (context) => {
  // Register this plugin
  context.addPlugin({
    name: 'Example Plugin',
    description: 'I help test plugins',
    snapshot: async (context) => {
      context.addedSnapshot = true
    },
    customChecks: {
      checkThing: async (rule, context) => {
        return {
          pass: true,
          message: 'Yeah good check!'
        }
      },
      checkSecondThing: async (rule, context) => {
        return {
          pass: false,
          message: 'Boooo failed check'
        }
      }
    }
  })

  return context
}
