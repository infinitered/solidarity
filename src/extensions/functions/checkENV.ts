import { ENVRule, SolidarityRunContext } from '../../types'
module.exports = (rule: ENVRule, context: SolidarityRunContext): void => {
  const envVar = rule.variable || ''
  if (!process.env[envVar]) throw new Error(`Environment variable ${envVar} not found`)
}
