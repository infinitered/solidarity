import { SolidarityRunContext, SolidarityRule } from '../../../../types'
const checkDir = require('../../checkDir')

export default async (context: SolidarityRunContext): Promise<SolidarityRule> => {
  const { print, prompt } = context

  let repeat = true
  let dirPath = { value: '' }
  while (repeat) {
    dirPath = (await prompt.ask({
      name: 'value',
      type: 'input',
      message: "Enter the path to the directory you'd like to enforce",
    })) as any

    try {
      // Check dir for existence
      checkDir({ location: dirPath.value }, context)
      repeat = false
    } catch (e) {
      print.error('Directory not found on this machine.')
      const tryAgain = await prompt.confirm('Would you like to try a different path?')

      repeat = tryAgain
    }
  }

  print.success(`Enforcing DIR for ${dirPath.value}`)
  return { rule: 'dir', location: dirPath.value }
}
