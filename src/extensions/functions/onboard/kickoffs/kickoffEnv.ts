import { SolidarityRunContext, SolidarityRule } from '../../../../types'

export default async (context: SolidarityRunContext): Promise<SolidarityRule> => {
  const { print, prompt } = context
  const pickSentence = 'Pick from existing environment vars on this machine'
  const typeSentence = 'Type the name of the environment variable to enforce'

  const envStyle = await prompt.ask({
    name: 'value',
    type: 'select',
    message: 'How would you like to pick your environment variable',
    choices: [pickSentence, typeSentence],
  })

  let pickEnv
  if (envStyle.value === pickSentence) {
    pickEnv = await prompt.ask({
      name: 'value',
      type: 'select',
      message: 'Which environment variable would you like to enforce?',
      choices: Object.keys(process.env),
    })
  } else {
    pickEnv = await prompt.ask({
      name: 'value',
      type: 'input',
      message: 'Which environment variable would you like to enforce?',
    })
  }

  if (pickEnv.value === pickSentence || pickEnv.value === typeSentence) {
    throw new Error('No Environment Variable was chosen')
  } else {
    print.success(`Enforcing ENV for ${pickEnv.value}`)
    return { rule: 'env', variable: pickEnv.value }
  }
}
