import { FSRule, SolidarityRunContext } from '../../types'
import * as path from 'path'
module.exports = (rule: FSRule, context: SolidarityRunContext): void => {
  const { filesystem } = context
  if (rule.location) {
    const dirPath = path.isAbsolute(rule.location) ? rule.location : path.join(process.cwd(), rule.location)
    if (filesystem.exists(dirPath) !== 'dir') {
      throw new Error(rule.error || `Location '${rule.location}' is not a directory`)
    }
  } else {
    throw new Error(`No location for directory rule`)
  }
}
