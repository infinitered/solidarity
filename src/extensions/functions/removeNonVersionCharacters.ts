import { SolidarityRule } from '../../types'
module.exports = (rule: SolidarityRule, line: string): string => {
  const foundVersions = line.match(/(\d+\.)?(\d+\.)?(\d+)([^\sa-zA-Z0-9]+\w+)?/g)
  try {
    const matchIndex = rule.matchIndex || 0
    return foundVersions[matchIndex]
  } catch (_e) {
    throw ` No version was detected from the output of the binary '${rule.binary}'`
  }
}
