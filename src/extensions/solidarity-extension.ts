const callsite = require('callsite')
const path = require('path')
// Adding our goodies to the context
module.exports = (context) => {
  context.solidarity = {
    binaryExists: require('./functions/binaryExists'),
    getSolidaritySettings: require('./functions/getSolidaritySettings'),
    setSolidaritySettings: require('./functions/setSolidaritySettings'),
    checkRequirement: require('./functions/checkRequirement'),
    updateRequirement: require('./functions/updateRequirement'),
    skipRule: require('./functions/skipRule'),
    checkENV: require('./functions/checkENV'),
    checkCLI: require('./functions/checkCLI'),
    checkDir: require('./functions/checkDir'),
    checkFile: require('./functions/checkFile'),
    updateVersions: require('./functions/updateVersions'),
    removeNonVersionCharacters: require('./functions/removeNonVersionCharacters'),
    getVersion: require('./functions/getVersion'),
    getLineWithVersion: require('./functions/getLineWithVersion')
  }
  // place for plugins
  context._pluginsList = []
  // the add plugin function
  context.addPlugin = (pluginConfig) => {
    // I'll fiinnnnd youuuu... calling function
    const stack = callsite()
    const requester = stack[1].getFileName()
    const templateDirectory = path.join(path.dirname(requester), '../templates/')

    context._pluginsList.push({
      templateDirectory,
      ...pluginConfig
    })
  }
  // Flavored separator
  context.printSeparator = () =>
    context.print.info(context.print.colors.america('-----------------------------------------------------------------------------------'))
}
