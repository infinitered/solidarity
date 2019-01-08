import { SolidarityRunContext, SolidaritySettings } from '../../types'
import { loadFile, loadModule, loadWebCheck } from './getSolidarityHelpers'
import * as JSON5 from 'json5'

module.exports = async (context: SolidarityRunContext): Promise<SolidaritySettings> => {
  const { filesystem, parameters } = context
  const options = parameters.options || {} // fix possibly undefined from gluegun
  const demandedFile = options.solidarityFile || options.f
  const demandedModule = options.module || options.d
  const demandedCheck = options.stack || options.t

  /* for now only JSON and JSON5 support
   * Summary:
   * Looks for `.solidarity` or `.solidarity.json` files
   * Unless you pass parameter options telling us to look
   * in specific paths, node modules, or websites
   */
  let solidaritySettings
  if (demandedFile) {
    solidaritySettings = loadFile(context, demandedFile)
  } else if (demandedModule) {
    solidaritySettings = loadModule(context, demandedModule)
  } else if (demandedCheck) {
    solidaritySettings = await loadWebCheck(context, demandedCheck)
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
