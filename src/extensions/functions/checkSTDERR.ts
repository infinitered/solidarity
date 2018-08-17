import { CLIRule, SolidarityRunContext } from '../../types'

const currentPlatform = process.platform
// Get the version of a specific CLI
module.exports = async (rule: CLIRule, context: SolidarityRunContext): Promise<string> => {
  const { system } = context

  let grabErrorOutput: string
  if (currentPlatform === 'win32') {
    const tempFile = `solidarityWinFix${rule.binary}.tmp`
    grabErrorOutput = `1>${tempFile} 2>&1 & type ${tempFile} & del ${tempFile}`
  } else {
    grabErrorOutput = '2>&1 | cat'
  }

  return system.run(`${rule.binary} ${rule.version} ${grabErrorOutput}`)
}
