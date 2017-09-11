// @solidarityDescription Take a snapshot of the versions and store in .solidarity file

module.exports = async function (context) {
  const { print } = context
  const { colors } = print

  print.info(colors.bgGreen(colors.black('i like trees')))

}
