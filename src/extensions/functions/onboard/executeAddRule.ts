import { SolidarityRunContext, SolidaritySettings } from '../../../types'
import Kickoffs from './kickoffs'

// TODO: Make this fancier
export default async (context: SolidarityRunContext, answer: string): Promise<void> => {
  const { print } = context
  print.success('ADD RULE ' + answer)
  let rule
  switch (answer) {
    case 'cli':
      print.info('Kickoff CLI')
      rule = await Kickoffs.kickoffCLI(context)
      break
    case 'env':
      print.info('Kickoff ENV')
      rule = await Kickoffs.kickoffEnv(context)
      break
    case 'file':
      print.info('Kickoff FILE')
      rule = await Kickoffs.kickoffFile(context)
      break
    case 'dir':
      print.info('Kickoff DIR')
      rule = await Kickoffs.kickoffDir(context)
      break
    case 'shell':
      print.info('Kickoff SHELL')
      rule = await Kickoffs.kickoffShell(context)
      break
    default:
      print.info('This should never happen')
      throw('unknown rule type')
  }

  // Now ask questions for ALL rules
  rule = await Kickoffs.kickoffAllRules(context, rule)
  // Now add rule to requirement

}
