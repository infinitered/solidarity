import { FSRule, SolidarityRunContext } from '../../types'
module.exports = (rule: FSRule, context: SolidarityRunContext): boolean => {
  const { filesystem } = context
  if (rule.location) {
    return filesystem.exists(rule.location) === 'file'
  } else {
    return false
  }
}
