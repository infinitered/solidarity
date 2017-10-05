// Adding our goodies to the context
module.exports = (context) => {
  context.solidarity = {
    checkCLI: require('./functions/checkCLI'),
    checkENV: require('./functions/checkENV'),
    checkRequirement: require('./functions/checkRequirement'),
    getSolidaritySettings: require('./functions/getSolidaritySettings'),
    skipRule: require('./functions/skipRule'),
    updateVersions: require('./functions/updateVersions')
  }
  // place for plugins
  context.pluginsList = []
  // Flavored separator
  context.printSeparator = () =>
    context.print.info(context.print.colors.america('-----------------------------------------------------------------------------------'))
}
