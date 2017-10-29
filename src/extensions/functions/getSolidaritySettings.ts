import { SolidarityRunContext, SolidaritySettings } from '../../types'
module.exports = (context: SolidarityRunContext): SolidaritySettings => {
  const { filesystem } = context

  // for now only JSON support
  let solidaritySettings
  if (filesystem.exists('.solidarity')) {
    solidaritySettings = JSON.parse(filesystem.read('.solidarity'))
  } else if (filesystem.exists('.solidarity.json')) {
    solidaritySettings = JSON.parse(filesystem.read('.solidarity.json'))
  } else {
    // if we got here there was no solidarity file
    throw 'ERROR: No solidarity file was found'
  }

  // Check shape
  if (solidaritySettings.requirements) {
    return solidaritySettings
  } else {
    throw 'ERROR: Found, but no requirements key.  Please validate your solidarity file'
  }
}
