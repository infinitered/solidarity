// @solidarityDescription Check location of known apps.

namespace Doctor {
  export const run = async (context) => {
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
}

// Export command
module.exports = {
  description: '',
  alias: 'd',
  run: Doctor.run
}
