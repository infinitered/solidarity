import { SolidarityRunContext } from '../../../types'
// TODO: Make this fancier
export default (context: SolidarityRunContext): void => {
  const { print } = context
  print.success('Welcome to Solidarity Wizard')
}
