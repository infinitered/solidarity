module.exports = (binary, context) => {
  const { system } = context

  // Check if binary exists
  try {
    system.which(binary)
    return true
  } catch (_e) {
    return false
  }

}
