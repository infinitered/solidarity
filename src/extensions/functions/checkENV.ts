import { SolidarityRule, SolidarityRunContext } from '../../types'
module.exports = (rule: SolidarityRule, context: SolidarityRunContext): string => {
  return process.env[rule.variable]
}
