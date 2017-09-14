module.exports = context => {
  const { print, filesystem } = context
  const { colors } = print
  if (filesystem.exists('.solidarity')) {
    try {
      // for now only JSON support
      return JSON.parse(filesystem.read('.solidarity'))
    } catch (e) {
      print.error(e)
      process.exit(1)
    }
  } else {
    print.error('ERROR: No `.solidarity` file found')
    print.info(
      `Make sure you are in the correct folder or run ${colors.success(
        'solidarity snapshot'
      )} to take a snapshot of your environment and create a .solidarity file for this project.`
    )
    process.exit(1)
  }
}
