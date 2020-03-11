import { SolidarityRunContext, SolidarityRule } from '../../../../types'

export default async (context: SolidarityRunContext): Promise<SolidarityRule> => {
  // const { print } = context
  // print.info(`kickoff CLI function`)
  return { rule: 'cli', binary: '' }
}
