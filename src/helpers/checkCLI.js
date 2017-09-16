module.exports = async (rule, context) => {
  const { system } = context

  // First check for binary
  try {
    system.which(rule.binary)
  } catch (_e) {
    return `Binary '${rule.binary}' not found`
  }
}
