import { SolidarityRunContext, SolidarityRule } from '../../../types'
// TODO: Make this fancier
export default (context: SolidarityRunContext, rules: Array<SolidarityRule>): void => {
  const { print, solidarity: { setSolidaritySettings} } = context

  setSolidaritySettings({ requirements: rules }, context)
  print.success('Review and Save')
  print.success('For full custom rules documentation visit: https://infinitered.github.io/solidarity/#/docs/options?id=solidarity-rules')
}
