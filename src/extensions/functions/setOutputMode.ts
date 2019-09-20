import { SolidarityOutputMode, SolidaritySettings } from '../../types'

module.exports = (parameters, settings: SolidaritySettings): SolidarityOutputMode => {
  const { options } = parameters
  // CLI flags override config
  if (options.verbose || options.a) {
    return SolidarityOutputMode.VERBOSE
  } else if (options.silent || options.s) {
    return SolidarityOutputMode.SILENT
  } else if (options.moderate || options.m) {
    return SolidarityOutputMode.MODERATE
  }

  // Set output mode, set to default on invalid value
  let outputModeString = settings.config ? String(settings.config.output).toUpperCase() : 'MODERATE'
  return SolidarityOutputMode[outputModeString] || SolidarityOutputMode.MODERATE
}
