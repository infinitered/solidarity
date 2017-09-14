module.exports = (context) => {
  const {print, filesystem} = context
  try {
    // for now only JSON support
    return JSON.parse(filesystem.read('.solidarity'))
  } catch (e) {
    print.error(e)
    process.exit(1)
  }
}
