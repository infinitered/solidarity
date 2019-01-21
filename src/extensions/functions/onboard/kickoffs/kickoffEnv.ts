import { SolidarityRunContext, SolidarityRule } from '../../../../types'

export default async (context: SolidarityRunContext): Promise<SolidarityRule> => {
  const { print, prompt } = context
  const pickSentence = 'Pick from existing environment vars on this machine'
  const typeSentence = 'Type the name of the environment variable to enforce'

  const envStyle = await prompt.ask({
    name: 'value',
    type: 'list',
    default: pickSentence,
    message: 'How would you like to pick your environment variable',
    choices: [
      pickSentence,
      typeSentence
    ]
  })

  let pickEnv
  if (envStyle.value === pickSentence) {
    pickEnv = await prompt.ask({
      name: 'value',
      type: 'list',
      message: 'Which environment variable would you like to enforce?',
      default: 'cli',
      choices: Object.keys(process.env)
    })
  } else {
    pickEnv = await prompt.ask({
      name: 'value',
      type: 'input',
      message: 'Which environment variable would you like to enforce?'
    })
  }

  if (pickEnv.value === pickSentence || pickEnv.value === typeSentence) {
    throw new Error('No Environment Variable was chosen')
  } else {
    // Now figure out how to save that stuff to a buffer of rules to write
    console.log('SELECTED', pickEnv.value)
    return { rule: 'env', variable: pickEnv.value }
  }
}
