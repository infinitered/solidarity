// @solidarityDescription Check location of known apps.
const run = async (context) => {
  const { print, system } = context

  const rn = await system.which(`react-native`)
  const xcrun = await system.which('xcrun')
  const androidHome = process.env['ANDROID_HOME']

  // generic printing
  print.table([
    ['react native', rn],
    ['xcrun', xcrun],
    ['android home', androidHome]
  ])
}

module.exports = {
  run
}
