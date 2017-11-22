import { CLIRule } from '../../types'
module.exports = (rule: CLIRule, line: string): string => {
  const foundVersions = line.match(/(\d+\.)?(\d+\.)?(\d+)([^\sa-zA-Z0-9]+\w+)?/g)

  if (Array.isArray(foundVersions)) {
    const matchIndex = rule.matchIndex || 0
    return foundVersions[matchIndex]
  } else {
    throw ` No version was detected from the output of the binary '${rule.binary}'`
  }
}
