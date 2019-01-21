import { SolidarityRunContext } from '../../../types'
// TODO: Make this fancier
export default async (context: SolidarityRunContext): Promise<boolean> => {
  // SHORTCUT FOR DEV
  return false


  const { print, prompt } = context
  print.success('ADD MORE')
  const userAnswer = await prompt.ask({
    name: 'continue',
    type: 'confirm',
    message: 'Would you like to add another rule?',
  })

  return userAnswer.continue
}
