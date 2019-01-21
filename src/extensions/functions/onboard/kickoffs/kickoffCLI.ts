import { SolidarityRunContext, SolidarityRule } from '../../../../types'

export default async (context: SolidarityRunContext): Promise<void> => {
  const { print, prompt } = context
  print.info(`kickoff CLI function`)
  // return { rule: 'cli' }
}
