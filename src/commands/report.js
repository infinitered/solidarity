// @solidarityDescription Checks various programs.
const { head, last, trim, pipe, split, replace } = require('ramda')

module.exports = async (context) => {
  const { print, system } = context
  const { colors } = print

  const spinner = context.print.spin('Verifying Versions')

  // chomp result and kill `v` from versions (yeah node... we're talking about you!)
  // if nothing is returned, swap out for `None`
  const runTrim = async (command) => pipe(trim, replace('v', ''))(await system.run(command))
  const printSeparator = () => print.info(colors.america('---------------------------------------'))

  const rnVersionRaw = await runTrim(`react-native --version`)
  const rnVersion = pipe(split('\n'), head, trim, split(' '), last)(rnVersionRaw)
  const nodeVersion = await runTrim('node --version')
  const npmVersion = await runTrim('npm --version')
  const yarnVersion = await runTrim('yarn --version')
  const xcodeBuild = await runTrim('xcodebuild -version | head -1 | sed "s/Xcode //"')
  const cocoapods = await runTrim('pod --version')
  const codePush = await runTrim('code-push --version')
  const mobileCenter = await runTrim('mobile-center -v | awk "{print $3}"')

  // android?
  // if > 25? cat $ANDROID_HOME/platform-tools/source.properties | grep Pkg.Revision
  //   const androidVersion = await system.run(`$ANDROID_HOME/tools/bin/sdkmanager --list | grep 'build-tools;#{ANDROID_SDK}' | tail -1 | awk '{print $3}'`)
  // else?
  //   cat $ANDROID_HOME/tools/source.properties | grep Pkg.Revision
  const androidSDKVersion = await runTrim(`$ANDROID_HOME/tools/android list sdk | grep 'SDK Tools' | tail -1 | awk '{print $6}'`)

  spinner.succeed('Check Success')

  printSeparator()
  // generic printing
  print.table([
    ['Tool', 'Version'],
    ['---', '---'],
    ['react-native', rnVersion],
    ['node', nodeVersion],
    ['NPM', npmVersion],
    ['yarn ', yarnVersion],
    ['Android SDK', androidSDKVersion],
    ['Xcode', xcodeBuild],
    ['Cocoapods', cocoapods],
    ['Code Push', codePush],
    ['Mobile Center', mobileCenter]
  ])
  printSeparator()
}
