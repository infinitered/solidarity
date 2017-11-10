import { SolidarityRule } from '../../types'
module.exports = (rule: SolidarityRule, versionOutput: string): string => {
  let result
  if (typeof rule.line === 'number') {
    result = versionOutput.split('\n')[rule.line - 1]
  } else if (typeof rule.line === 'string') {
    const findString = `.*${rule.line}.*`
    const findRegex = RegExp(findString, 'g')
    const foundLines = versionOutput.match(findRegex)
    if (Array.isArray(foundLines)) {
      // Always first instance
      result = foundLines[0]
    } else {
      throw `rule.line string '${rule.line}' was not found`
    }
  } else {
    // pass it through if rules don't provide a line
    result = versionOutput
  }
  return result
}
