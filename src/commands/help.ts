import { GluegunCommand } from 'gluegun'

module.exports = {
  alias: 'h',
  description: 'Displays this help',
  run: (context) => {
    const { print } = context
    const { colors } = print
    print.success('\nSolidarity')
    print.info(' Commands')
    print.printCommands(context)
    print.info('\n Flags\n')
    print.info('  --verbose\t Prints all detected info during solidarity check')

    print.success(colors.magenta('\nSolidarity is open source - https://github.com/infinitered/solidarity'))
    print.info(colors.magenta('If you need additional help, join our Slack at http://community.infinite.red'))
  }
} as GluegunCommand
