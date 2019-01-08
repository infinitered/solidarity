import { SolidarityToolbox } from '../../types'
module.exports = (binary: string, context: SolidarityToolbox): boolean => {
  const { system } = context

  // Check if binary exists
  return Boolean(system.which(binary))
}
