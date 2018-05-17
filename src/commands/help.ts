import { GluegunCommand } from 'gluegun'

module.exports = {
  alias: 'h',
  description: 'Displays this help',
  run: context => {
    const { print } = context
    const { colors } = print
    print.success('\nSolidarity')
    print.info(' Commands')
    print.printCommands(context)
    print.info('\n Flags\n')
    print.info('  --verbose\t (-a) Prints all detected info during solidarity check')
    print.info('  --moderate\t (-m) Prints failures in check or single success message')
    print.info('  --silent\t (-s) No output, just a return code of success/failure')
    print.info('  --solidarityFile\t (-f) Use given path to solidarity file for settings')
    print.info('  --module\t (-m) Search for a solidarity file in the given npm package')

    print.success(colors.magenta('\nSolidarity is open source - https://github.com/infinitered/solidarity'))
    print.info(colors.magenta('If you need additional help, join our Slack at http://community.infinite.red'))
  },
} as GluegunCommand
