import { SolidarityRunContext } from '../../types'
module.exports = (binary: string, context: SolidarityRunContext): boolean => {
  const { system } = context

  // Check if binary exists
  try {
    system.which(binary)
    return true
  } catch (_e) {
    return false
  }

}
