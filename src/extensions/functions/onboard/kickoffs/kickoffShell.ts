import { SolidarityRunContext } from '../../../../types'

export default async (context: SolidarityRunContext): Promise<void> => {
  const { print, prompt } = context
  print.info(`kickoff Shell function`)

}
