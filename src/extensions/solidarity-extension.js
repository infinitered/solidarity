// Adding our goodies to the context
module.exports = (context) => {
  context.solidarity = {
    checkCLI: require('./functions/checkCLI'),
    checkENV: require('./functions/checkENV'),
    checkRequirement: require('./functions/checkRequirement'),
    getSolidaritySettings: require('./functions/getSolidaritySettings'),
    skipRule: require('./functions/skipRule')
  }
  // place for plugins
  context.pluginsList = []
}
