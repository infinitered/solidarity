module.exports = async (rule, context) => {
  const { system, semver } = context

  // First check for binary
  try {
    system.which(rule.binary)
  } catch (_e) {
    return `Binary '${rule.binary}' not found`
  }

  // Is there a semver rule?
  if (rule.semver) {

  }
}
