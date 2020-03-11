import { SolidarityRunContext, SolidarityRule } from '../../../../types'

export default async (context: SolidarityRunContext): Promise<SolidarityRule> => {
  // const { print } = context
  // print.info(`kickoff Shell function`)
  return { rule: 'shell', command: '', match: '' }
}
