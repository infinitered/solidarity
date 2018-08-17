import { CLIRule } from '../../types'

// Creates STDERR catching string
module.exports = (rule: CLIRule): string => {
  const currentPlatform = process.platform
  let grabErrorOutput: string
  if (currentPlatform === 'win32') {
    const tempFile = `solidarityWinFix${rule.binary}.tmp`
    grabErrorOutput = `1>${tempFile} 2>&1 & type ${tempFile} & del ${tempFile}`
  } else {
    grabErrorOutput = '2>&1 | cat'
  }

  return `${rule.binary} ${rule.version} ${grabErrorOutput}`
}
