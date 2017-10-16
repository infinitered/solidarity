import { GluegunRunContext } from 'gluegun'

module.exports = (binary: string, context: GluegunRunContext): boolean => {
  const { system } = context

  // Check if binary exists
  try {
    system.which(binary)
    return true
  } catch (_e) {
    return false
  }

}
