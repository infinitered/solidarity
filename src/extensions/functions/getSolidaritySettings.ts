import { SolidarityRunContext, SolidaritySettings } from '../../types'
import * as JSON5 from 'json5'
import * as path from 'path'

export const isURI = (path) => !!path.match(/\w+:(\/?\/?)[^\s]+/)

export const loadFile = (context, filePath) => {
  const { filesystem } = context
  if (filesystem.exists(filePath)) {
    return JSON5.parse(filesystem.read('.solidarity'))
  } else {
    throw 'ERROR: There is no solidarity file at the given path'
  }
}

export const loadModule = (context, moduleName) => {
  const { filesystem } = context
  // We will search that module
  const filePath = path.join('node_modules', moduleName, '.solidarity')

  if (filesystem.exists(filePath)) {
    return JSON5.parse(filesystem.read(filePath))
  } else if (filesystem.exists(filePath + '.json')) {
    return JSON5.parse(filesystem.read(filePath + '.json'))
  } else {
    throw 'ERROR: There is no solidarity file found with the given module'
  }
}

export const loadWebCheck = async (context, checkOption) => {
  const { print, http } = context
  const checkSpinner = print.spin(`Running check on ${checkOption}`)
  const api = http.create({
    baseURL: 'https://api.github.com'
  })

  // Load check from web
  const checkURL = isURI(checkOption) ? checkOption : `https:\/\/raw.githubusercontent.com/infinitered/solidarity-stacks/master/stacks/${checkOption}.solidarity`
  const result = await api.get(checkURL)
  // console.log(result)
  if (result.ok) {
    checkSpinner.succeed(`Found Stack: ${checkOption}`)
    // Convert strings to JSON5 objects
    const solidarityData = (typeof result.data === 'string')
      ? JSON5.parse(result.data)
      : result.data
    return solidarityData
  } else {
    checkSpinner.fail(`Unable to find a known check stack for ${checkOption}`)
    print.info(
      `Check https://github.com/infinitered/solidarity-stacks for options.`
    )
    throw(`ERROR: Request failed (${result.status} - ${result.problem})`)
  }
}

module.exports = async (context: SolidarityRunContext): Promise<SolidaritySettings> => {
  const { filesystem, parameters } = context
  const options = parameters.options || {} // fix possibly undefined from gluegun
  const demandedFile = options.solidarityFile || options.f
  const demandedModule = options.module || options.m
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
