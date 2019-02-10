import { SolidarityRunContext, SolidarityRule } from '../../../../types'

export default async (context: SolidarityRunContext, rule: SolidarityRule): Promise<SolidarityRule> => {
  const { prompt } = context

  ////////////////// CUSTOM ERROR MESSAGE?
  const customError = await prompt.ask({
    name: 'value',
    type: 'confirm',
    message: 'Would you like to write a custom error message for if this rule fails to pass?',
  })

  if (customError.value) {
    const errorMessage = await prompt.ask({
      name: 'value',
      type: 'input',
      message: 'Your custom error message',
    })

    rule.error = errorMessage.value
  }

  ////////////////// PLATFORM SPECIFIC?
  const platformSpecific = await prompt.ask({
    name: 'value',
    type: 'confirm',
    message: 'Should this rule only apply on certain operating systems?',
  })

  if (platformSpecific.value) {
    const platforms = await prompt.ask({
      name: 'value',
      type: 'checkbox',
      message: 'Which operating systems does this rule run for?',
      choices: ['macos', 'freebsd', 'linux', 'sunos', 'windows'],
    })
    rule.platform = platforms.value
  }

  ////////////////// SKIP CI?
  const ciSkip = await prompt.ask({
    name: 'value',
    type: 'confirm',
    message: 'Should this rule be skipped on a Continuous Integration server?',
  })

  if (ciSkip.value) {
    rule.ci = true
  }

  return rule
}
