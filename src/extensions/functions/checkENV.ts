import { SolidarityRule, SolidarityRunContext } from '../../types'
module.exports = (rule: SolidarityRule, context: SolidarityRunContext): string | undefined => {
  const envVar = rule.variable || ''
  return process.env[envVar]
}
