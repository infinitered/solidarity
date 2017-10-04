const run = async function (context) {
  const { print, prompt, filesystem } = context
  const printSeparator = () =>
    print.info(print.colors.america('-----------------------------------------------------------------------------------'))

    // check is there an existing .solidarity file?
  if (filesystem.exists('.solidarity')) {
    // load existing file and update rule versions
    print.info('Now loading latest environment')
  } else {
    // prompt for environment packages
    const userAnswer = await prompt.ask({
      name: 'createFile',
      type: 'confirm',
      message: 'No `.solidarity` file found for this project.  Would you like to create one?'
    })

    if (userAnswer.createFile) {
      // list visible plugins
      print.info('Available technology plugins:')
      printSeparator()
      if (context.pluginsList.length > 0) {
        print.info(context.pluginsList)
      } else {
        print.error(`No solidarity plugins found!

        Add a plugin for a given technology:
        ${print.colors.blue('https://github.com/infinitered/solidarity/blob/master/docs/pluginsList.md')}

        OR write your own plugin for generating rules:
        ${print.colors.blue('https://github.com/infinitered/solidarity/blob/master/docs/plugins.md')}

        OR simply create a .solidarity rule-set by hand for this project:
        ${print.colors.blue('https://github.com/infinitered/solidarity/blob/master/docs/options.md')}
        `)
      }
      printSeparator()
    } else {
      print.info('Nothing to do')
    }
  }
}

module.exports = {
  description: 'Take a snapshot of the versions and store in .solidarity file',
  alias: 's',
  run
}
