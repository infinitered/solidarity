import { CustomRule, SolidarityRunContext, PluginFind } from '../../types'

const { head, filter } = require('ramda')

module.exports = (rule: CustomRule, context: SolidarityRunContext): PluginFind => {
  // find correct rule function
  const correctPlugin = head(filter(plugin => plugin.name === rule.plugin, context._pluginsList))
  if (correctPlugin === undefined) {
    return {
      success: false,
      message: `Plugin not found '${rule.plugin}'`,
    }
  } else {
    const customRule = correctPlugin.rules && correctPlugin.rules[rule.name]
    if (customRule) {
      return {
        success: true,
        plugin: customRule,
      }
    } else {
      return {
        success: false,
        message: `NOT FOUND: Custom rule from '${rule.plugin}' plugin with check function '${rule.name}'`,
      }
    }
  }
}
