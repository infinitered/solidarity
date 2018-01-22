import { SolidarityRunContext, SolidaritySettings } from '../../types'
import * as JSON5 from 'json5'
module.exports = (context: SolidarityRunContext): SolidaritySettings => {
  const { filesystem } = context

  // for now only JSON and JSON5 support
  let solidaritySettings
  if (filesystem.exists('.solidarity')) {
    solidaritySettings = JSON5.parse(filesystem.read('.solidarity'))
  } else if (filesystem.exists('.solidarity.json')) {
    solidaritySettings = JSON5.parse(filesystem.read('.solidarity.json'))
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
