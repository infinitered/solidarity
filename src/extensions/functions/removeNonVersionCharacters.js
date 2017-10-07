module.exports = (rule, line) => {
  const foundVersions = line.match(/(\d+\.)?(\d+\.)?(\d+)([^\sa-zA-Z0-9]+\w+)?/g)
  // Return longest match, because it is most likely to be correct
  try {
    var result = foundVersions[0]
    for (let i = 1; i < foundVersions.length; i++) {
      if (foundVersions[i].length >= result.length) {
        result = foundVersions[i]
      }
    }
  } catch (_e) {
    throw `No version was detected from the output of the binary '${rule.binary}'`
  }
  return result
}
