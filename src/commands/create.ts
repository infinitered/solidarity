import { GluegunCommand } from 'gluegun'

const createables = ['plugin']

module.exports = {
  alias: 'c',
  description: 'Displays this help',
  run: async context => {
    const { print, solidarity, parameters } = context
    switch (parameters.first && parameters.first.toLowerCase()) {
      case 'plugin':
        // Handle errors like grown-ups
        try {
          await solidarity.createPlugin(context)
        } catch (e) {
          print.error(e)
        }
        break
      default:
        print.error('Missing what to create')
        print.error('$ solidarity create <wut?>')
        print.info(`Things you can create: ${createables}`)
    }
  },
} as GluegunCommand
