import { SolidarityRunContext, SolidarityRule } from '../../../../types'

export default async (context: SolidarityRunContext): Promise<SolidarityRule> => {
  return { rule: 'shell', command: '', match: '' }
}
