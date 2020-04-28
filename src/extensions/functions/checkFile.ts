import { FSRule, SolidarityRunContext } from '../../types'
import * as path from 'path'
module.exports = (rule: FSRule, context: SolidarityRunContext): void => {
  const { filesystem } = context
  if (rule.location) {
    const filePath = path.isAbsolute(rule.location) ? rule.location : path.join(process.cwd(), rule.location)
    if (filesystem.exists(filePath) !== 'file') {
      throw new Error(rule.error || `Location '${rule.location}' is not a file`)
    }
  } else {
    throw new Error(`No location for file rule`)
  }
}
