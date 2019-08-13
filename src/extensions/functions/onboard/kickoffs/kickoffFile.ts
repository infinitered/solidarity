import { SolidarityRunContext, SolidarityRule } from '../../../../types'
const checkFile = require('../../checkFile')

export default async (context: SolidarityRunContext): Promise<SolidarityRule> => {
  const { print, prompt } = context

  let repeat = true
  let filePath = { value: '' }
  while (repeat) {
    filePath = await prompt.ask({
      name: 'value',
      type: 'input',
      message: "Enter the path to the file you'd like to enforce",
    })

    try {
      // Check file for existence
      checkFile({ location: filePath.value }, context)
      repeat = false
    } catch (e) {
      print.error('File not found on this machine.')
      const tryAgain = await prompt.confirm('Would you like to try a different path?')

      repeat = tryAgain
    }
  }

  print.success(`Enforcing DIR for ${filePath.value}`)
  return { rule: 'file', location: filePath.value }
}
