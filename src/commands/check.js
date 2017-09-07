// @solidarityDescription Checks various programs.
const { head, last, trim, pipe, split } = require('ramda')

module.exports = async function (context) {
  const { print, system } = context

  // mish-mash of example things
  const rn = await system.which(`react-native`)
  const rnVersionRaw = await system.run(`react-native --version`)
  const rnVersion = pipe(trim, split('\n'), head, trim, split(' '), last)(rnVersionRaw)

  const xcrun = await system.which(`xcrun`)
  const androidHome = process.env['ANDROID_HOME']

  // generic printing
  print.table([
    ['react-native', rn],
    ['react-native version', rnVersion],
    ['xcrun', xcrun],
    ['android home', androidHome]
  ])
}
