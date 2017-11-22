import { ENVRule, SolidarityRunContext } from '../../types'
module.exports = (rule: ENVRule, context: SolidarityRunContext): string | undefined => {
  const envVar = rule.variable || ''
  return process.env[envVar]
}
