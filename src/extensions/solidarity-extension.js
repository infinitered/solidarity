// Adding our goodies to the context
module.exports = (context) => {
  context.solidarity = {
    getSolidaritySettings: require('./functions/getSolidaritySettings'),
    setSolidaritySettings: require('./functions/setSolidaritySettings'),
    checkRequirement: require('./functions/checkRequirement'),
    updateRequirement: require('./functions/updateRequirement'),
    skipRule: require('./functions/skipRule'),
    checkENV: require('./functions/checkENV'),
    checkCLI: require('./functions/checkCLI'),
    updateVersions: require('./functions/updateVersions'),
    removeNonVersionCharacters: require('./functions/removeNonVersionCharacters'),
    getVersion: require('./functions/getVersion'),
    getLineWithVersion: require('./functions/getLineWithVersion')
  }
  // place for plugins
  context.pluginsList = []
  // Flavored separator
  context.printSeparator = () =>
    context.print.info(context.print.colors.america('-----------------------------------------------------------------------------------'))
}
