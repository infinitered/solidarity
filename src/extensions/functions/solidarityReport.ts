import { SolidarityRunContext, SolidarityReportResults, CLIReportConfig } from '../../types'
import { helpers } from 'envinfo'

export const createReport = (context: SolidarityRunContext): SolidarityReportResults => {
  const { print, system } = context
  const { colors } = print

  return {
    basicInfo: [['System Basics', 'Value'], ['OS', helpers.getOperatingSystemInfo()], ['CPU', helpers.getCPUInfo()]],
    cliRules: [['Binary', 'Location', 'Version', 'Desired']],
    envRules: [['Environment Var', 'Value']],
    filesystemRules: [['Location', 'Type', 'Exists']],
    shellRules: [['Command', 'Pattern', 'Matches']],
    customRules: [],
    // helper for adding CLI rules
    addCLI: function (cliReportConfig: CLIReportConfig) {
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
