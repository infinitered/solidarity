import { SolidarityRunContext } from '../../types'
module.exports = (binary: string, context: SolidarityRunContext): boolean => {
  const { system } = context

  // Check if binary exists
  return Boolean(system.which(binary))
}
