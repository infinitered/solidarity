import { SolidarityRule, SolidarityRunContext } from '../../types'
module.exports = (rule: SolidarityRule, context: SolidarityRunContext): boolean => {
  const {filesystem} = context
  if (rule.location) {
    return filesystem.exists(rule.location) === 'dir'
  } else {
    return false
  }
}
