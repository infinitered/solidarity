import { ShellRule, SolidarityRunContext } from '../../types'

module.exports = async (rule: ShellRule, context: SolidarityRunContext): Promise<boolean> => {
  const { system, strings } = context
  try {
    // execute the command
    const exec = await system.spawn(rule.command, { shell: true })
    const { stdout = '' } = exec

    // clean it up
    const output = strings.trimEnd(stdout.toString())

    // look for matches
    let isMatch: boolean = false
    const match = rule.match && new RegExp(rule.match)
    if (match) {
      isMatch = match.test(output)
    }

    const standardError = `Shell rule '${rule.command}' output did not contain match: ${match}`
    if (!isMatch) throw new Error(rule.error || standardError)
  } catch (e) {
    throw new Error(rule.error || e.message)
  }
}
