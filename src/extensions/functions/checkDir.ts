import { FSRule, SolidarityRunContext } from '../../types'
module.exports = (rule: FSRule, context: SolidarityRunContext): void => {
  const { filesystem } = context
  if (rule.location) {
    if (filesystem.exists(rule.location) !== 'dir') throw new Error(`Location '${rule.location}' is not a directory`)
  } else {
    throw new Error(`No location for directory rule`)
  }
}
