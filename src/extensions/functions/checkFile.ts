import { FSRule, SolidarityRunContext } from '../../types'
module.exports = (rule: FSRule, context: SolidarityRunContext): void => {
  const { filesystem } = context
  if (rule.location) {
    if (filesystem.exists(rule.location) === 'file') throw new Error(`Location '${rule.location}' is not a file`)
  } else {
    throw new Error(`No location for file rule`)
  }
}
