// @solidarityDescription Checks various programs.
const { head, last, trim, pipe, split, replace } = require('ramda')

module.exports = async function (context) {
  const { print, system } = context

  const spinner = context.print.spin('Verifying')

  // chomp result and kill `v` from versions (yeah node... we're talking about you!)
  // if nothing is returned, swap out for `None`
  const runTrim = async (command) => pipe(trim, replace('v', ''))(await system.run(command))

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

  spinner.succeed('Check Success')
  print.info('-----------------')
  // generic printing
  print.table([
    ['react-native version', rnVersion],
    ['node version', nodeVersion],
    ['NPM version', npmVersion],
    ['yarn version', yarnVersion],
    // ['Android Version', androidVersion],
    ['Xcode', xcodeBuild],
    ['Cocoapods', cocoapods],
    ['Code Push', codePush],
    ['Mobile Center', mobileCenter],
  ])

}
