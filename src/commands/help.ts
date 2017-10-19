import { GluegunCommand } from 'gluegun'

module.exports = {
  alias: 'h',
  description: 'Displays this help',
  run: (context) => context.print.printCommands(context)
} as GluegunCommand
