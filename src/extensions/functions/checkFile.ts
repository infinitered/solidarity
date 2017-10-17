import { SolidarityRule, SolidarityRunContext } from '../../types'
module.exports = (rule: SolidarityRule, context: SolidarityRunContext): boolean => {
  const {filesystem} = context
  return filesystem.exists(rule.location) === 'file'
}
