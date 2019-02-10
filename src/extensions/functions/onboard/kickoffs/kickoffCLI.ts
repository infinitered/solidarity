import { SolidarityRunContext } from '../../../../types'

export default async (context: SolidarityRunContext): Promise<void> => {
  const { print } = context
  print.info(`kickoff CLI function`)
  // return { rule: 'cli' }
}
