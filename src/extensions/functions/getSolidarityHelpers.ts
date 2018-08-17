import * as JSON5 from 'json5'
import * as path from 'path'

export const isURI = (path) => !!path.match(/\w+:(\/?\/?)[^\s]+/)

export const loadFile = (context, filePath) => {
  const { filesystem } = context
  if (filesystem.exists(filePath) === 'file') {
    return JSON5.parse(filesystem.read(filePath))
  } else if (filesystem.exists(filePath + path.sep + '.solidarity')) {
    return JSON5.parse(filesystem.read(filePath + path.sep + '.solidarity'))
  } else if (filesystem.exists(filePath + path.sep + '.solidarity.json')) {
    return JSON5.parse(filesystem.read(filePath + path.sep + '.solidarity.json'))
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
  const { print, http, parameters } = context
  const { options } = parameters
  const silentMode = options.silent || options.s
  const moderateMode = options.moderate || options.m
  const checkSpinner = silentMode || moderateMode ? null : print.spin(`Running check on ${checkOption}`)
  // the base URL is throw away, and will go away in next version of apisauce
  const api = http.create({
    baseURL: 'https://api.github.com',
    timeout: 10000 // 10 seconds
  })

  // Load check from web
  const checkURL = isURI(checkOption) ? checkOption : `https:\/\/raw.githubusercontent.com/infinitered/solidarity-stacks/master/stacks/${checkOption}.solidarity`
  const result = await api.get(checkURL)
  // console.log(result)
  if (result.ok) {
    checkSpinner && checkSpinner.succeed(`Found Stack: ${checkOption}`)
    // Convert strings to JSON5 objects
    const solidarityData = (typeof result.data === 'string')
      ? JSON5.parse(result.data)
      : result.data
    return solidarityData
  } else {
    checkSpinner && checkSpinner.fail(`Unable to find a known tech stack for ${checkOption}`)
    if (!silentMode) {
      print.info(
        `Check https://github.com/infinitered/solidarity-stacks for options.`
      )
    }
    throw(`ERROR: Request failed (${result.status} - ${result.problem})`)
  }
}

module.exports = {
  isURI,
  loadFile,
  loadModule,
  loadWebCheck
}
