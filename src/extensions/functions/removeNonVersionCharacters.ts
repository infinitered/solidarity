module.exports = (rule, line) => {
  const foundVersions = line.match(/(\d+\.)?(\d+\.)?(\d+)([^\sa-zA-Z0-9]+\w+)?/g)
  // Return longest match, because it is most likely to be correct
  let result
  try {
    result = foundVersions[0]
  } catch (_e) {
    throw ` No version was detected from the output of the binary '${rule.binary}'`
  }
  return result
}
