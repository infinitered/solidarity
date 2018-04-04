import { SolidarityRunContext, SolidaritySettings } from '../../types'
import * as JSON5 from 'json5'
import * as path from 'path'

module.exports = (context: SolidarityRunContext): SolidaritySettings => {
  const { filesystem, parameters } = context
  const options = parameters.options || {} // fix possibly undefined from gluegun

  /* for now only JSON and JSON5 support
  * Summary:
  * Looks for `.solidarity` or `.solidarity.json` files
  * Unless you pass parameter options telling us to look
  * in specific paths or node modules
  */
  let solidaritySettings
  if (options.solidarityFile || options.f) {
    // They are telling us where to go
    const filePath = options.solidarityFile || options.f
    if (filesystem.exists(filePath)) {
      solidaritySettings = JSON5.parse(filesystem.read('.solidarity'))
    } else {
      throw 'ERROR: There is no solidarity file at the given path'
    }
  } else if (options.module || options.m) {
    // We will search that module
    const moduleName = options.module || options.m
    const filePath = path.join('node_modules', moduleName, '.solidarity')

    if (filesystem.exists(filePath)) {
      solidaritySettings = JSON5.parse(filesystem.read(filePath))
    } else if (filesystem.exists(filePath + '.json')) {
      solidaritySettings = JSON5.parse(filesystem.read(filePath + '.json'))
    } else {
      throw 'ERROR: There is no solidarity file found with the given module'
    }
  } else if (filesystem.exists('.solidarity')) {
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
