const { propEq, filter, head } = require('ramda')
const NONE = 'None'
const DO_NOTHING = 'Nothing to do ¯\\_(ツ)_/¯'

const createSolidarityFile = async (context) => {
  const { print, printSeparator } = context
  // list visible plugins
  printSeparator()
  print.info('Available technology plugins:\n')
  if (context.pluginsList.length > 0) {
    const pluginOptions = [NONE]
    context.pluginsList.map((plugin) => {
      print.info(`   ${plugin.name}:\t ${plugin.description}`)
      pluginOptions.unshift(plugin.name)
    })
    printSeparator()
    const answer = await context.prompt.ask({
      name: 'selectedPlugin',
      message: 'Which of the above technology snapshots will you use for this project?',
      type: 'list',
      choices: pluginOptions
    })

    if (answer.selectedPlugin === NONE) {
      print.info(DO_NOTHING)
    } else {
      // Config for selected plugin only
      const runPlugin = head(filter(propEq('name', answer.selectedPlugin), context.pluginsList))
      console.log(runPlugin)
      // run plugin
      // run snapshot
    }
  } else {
    print.error(`No solidarity plugins found!

    Add a plugin for a given technology:
    ${print.colors.blue('https://github.com/infinitered/solidarity/blob/master/docs/pluginsList.md')}

    OR write your own plugin for generating rules:
    ${print.colors.blue('https://github.com/infinitered/solidarity/blob/master/docs/plugins.md')}

    OR simply create a .solidarity rule-set by hand for this project:
    ${print.colors.blue('https://github.com/infinitered/solidarity/blob/master/docs/options.md')}
    `)
    printSeparator()
  }
}

const run = async function (context) {
  const { print, prompt, filesystem } = context

  // check is there an existing .solidarity file?
  if (filesystem.exists('.solidarity')) {
    // load existing file and update rule versions
    print.info('Now loading latest environment')
  } else {
    // Find out what they wanted
    const userAnswer = await prompt.ask({
      name: 'createFile',
      type: 'confirm',
      message: 'No `.solidarity` file found for this project.  Would you like to create one?'
    })

    if (userAnswer.createFile) {
      await createSolidarityFile(context)
    } else {
      print.info(DO_NOTHING)
    }
  }
}

module.exports = {
  description: 'Take a snapshot of the versions and store in .solidarity file',
  alias: 's',
  run
}
