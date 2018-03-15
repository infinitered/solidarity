import { SolidarityRunContext, SolidarityReportResults, CLIReportConfig } from '../../types'

export const createReport = (context: SolidarityRunContext): SolidarityReportResults => {
  const { print, system, envInfo } = context
  const { colors } = print

  return {
    basicInfo: [['System Basics', 'Value'], ['OS', envInfo.getOperatingSystemInfo()], ['CPU', envInfo.getCPUInfo()]],
    cliRules: [['Binary', 'Location', 'Version', 'Desired']],
    envRules: [['Environment Var', 'Value']],
    filesystemRules: [['Location', 'Type', 'Exists']],
    shellRules: [['Command', 'Pattern', 'Matches']],
    customRules: [],
    // helper for adding CLI rules
    addCLI: function(cliReportConfig: CLIReportConfig) {
      const desired = cliReportConfig.desired ? cliReportConfig.desired : colors.green('*ANY*')
      let location
      try {
        location = system.which(cliReportConfig.binary)
      } catch (_e) {
        location = colors.red('*MISSING*')
      }
      this.cliRules.push([cliReportConfig.binary, location, cliReportConfig.version, desired])
    },
  }
}
