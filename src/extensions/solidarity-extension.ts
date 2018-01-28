import { SolidarityRunContext, solidarity, SolidarityPlugin } from '../types'

const callsite = require('callsite')
const path = require('path')
// Adding our goodies to the context
module.exports = (context: SolidarityRunContext): void => {
  const { filesystem } = context
  context.solidarity = solidarity
  // place for plugins
  context._pluginsList = []
  // the add plugin function
  context.addPlugin = (pluginConfig: SolidarityPlugin) => {
    // I'll fiinnnnd youuuu... calling function
    const stack = callsite()
    const requester = stack[1].getFileName()
    const templateDirPotential = path.join(path.dirname(requester), '../templates/')
    // Don't store directories that aren't there!
    const templateDirectory = filesystem.exists(templateDirPotential)
      ? templateDirPotential
      : null

    context._pluginsList.push({
      templateDirectory,
      ...pluginConfig,
    })
  }

  // Flavored separator
  context.printSeparator = (): void =>
    context.print.info(
      context.print.colors.america(
        '-----------------------------------------------------------------------------------'
      )
    )
}
