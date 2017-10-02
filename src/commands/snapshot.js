const run = async function (context) {
  const { print, prompt, filesystem } = context
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
      print.info('Available technology plugins')
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
