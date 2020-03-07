import { SolidarityRunContext } from '../../../types'
// TODO: Make this fancier
export default async (context: SolidarityRunContext): Promise<string> => {
  const { print, prompt } = context
  print.info(`
  * cli = Enforce a CLI existence and version
  * env = Enforce existence of an environment variable
  * file = Enforce existence of a file
  * dir = Enforce existence of a directory
  * shell = Enforce output of a command to match
  `)
  const userAnswer = await prompt.ask({
    name: 'addRule',
    type: 'radio',
    message: 'What kind of rule would you like to add?',
    choices: ['cli', 'env', 'file', 'dir', 'shell'],
  })

  return userAnswer.addRule
}
